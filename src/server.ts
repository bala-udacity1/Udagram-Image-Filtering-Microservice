import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

var validUrl = require('valid-url');

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get( "/filteredimage", async ( req, res ) => {  
    const { image_url: filteredImageUrl } = req.query;
    if (!filteredImageUrl || !validUrl.isUri(filteredImageUrl)) {
      return res.status(400).send({ auth: false, message: 'image url is empty or invalid' });
    }

    const filteredPath = await filterImageFromURL(filteredImageUrl);

    res.sendFile(filteredPath, {} , () => deleteLocalFiles([filteredPath]));
  });

  /**************************************************************************** */ 
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
