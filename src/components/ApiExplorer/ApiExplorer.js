import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ApiExplorerWrapper } from './ApiExplorer.styled';

const extractSet = (obj, prop) => {
   console.log(obj)
   return new Set(Object.entries(obj).reduce((agg, [url, data]) => agg.concat(data[prop]), []));
}

const ApiExplorer = () => {

   const [people, setPeople] = useState({});
   const [query, setQuery] = useState('');
   const [films, setFilms] = useState({});
   const [species, setSpecies] = useState({});
   const [starships, setStarships] = useState({});
   const [vehicles, setVehicles] = useState({});

   
   useEffect(() => {
      const fetchData = async () => {
         const API_URL = "https://swapi.dev/api/people/";
         const response = await fetch(API_URL);
         const jsonRes = await response.json();
         const people = jsonRes.results.reduce((agg, curr) => {
            agg[curr.url] = curr;
            return agg; 
         }, {})
         const filmsUrls = extractSet(people, 'films');
         const starshipsUrls = extractSet(people, 'starships');
         const vehiclesUrls = extractSet(people, 'vehicles');
         const speciesUrls = extractSet(people, 'vehicles');
         setPeople(people);

         const promises = [filmsUrls, speciesUrls, vehiclesUrls, starshipsUrls].map(urls => {

            return Promise.all([...urls].map(url => fetch(url).then(
               e => e.json()
            ))).then((data) =>{
               console.log('data', data);
                  return data.reduce((agg, curr) => {
                     (agg[curr.url] = curr);
                     return agg;
                  }, {})
            });
         })
         const [filmsData, speciesData, vehiclesData, starshipsData] = await Promise.all(promises);
         setFilms(filmsData);
         setSpecies(speciesData);
         
         setVehicles(vehiclesData);
         setStarships(starshipsData);
         console.log('filmsData', filmsData);
      };
      fetchData();
   }, []);


 return <ApiExplorerWrapper data-testid="ApiExplorer">
      <div className='content-center'>
      <h3 className=''>Attributes</h3>
      <table className="table-auto">
         <thead>
            <tr>
               <th>NAME</th>
               <th>HEIGHT</th>
               <th>MASS</th>
               <th>HAIR COLOR</th>
               <th>SKIN COLOR</th>
               <th>EYE COLOR</th>
               <th>BIRTH YEAR</th>
               <th>GENDER</th>
               <th>FILMS</th>
            </tr>
         </thead>
         <tbody>
            {Object.entries(people).map(([url, character]) => 
               <tr>
                  <td>{character.name}</td> 
                  <td>{character.height}</td> 
                  <td>{character.mass}</td> 
                  <td>{character.hair_color}</td> 
                  <td>{character.skin_color}</td> 
                  <td>{character.eye_color}</td> 
                  <td>{character.birth_year}</td> 
                  <td>{character.gender}</td> 
                  <td>{character.films.map(url => films[url]?.name)} </td>
                  <td>{character.species.map(url => species[url]?.name)} </td>
                  <td>{character.vehicles.map(url => vehicles[url]?.name)} </td>
                  <td>{character.starships.map(url => starships[url]?.name)} </td>
               </tr>
            )}
            </tbody>

    </table>
    </div>
 </ApiExplorerWrapper>
};

ApiExplorer.propTypes = {};

ApiExplorer.defaultProps = {};

export default ApiExplorer;
