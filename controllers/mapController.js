
var secrets = require('../config/secrets');
var mongoose = require('mongoose');
var axios =require('axios');
var message = require('../models/message');
var {verifyToken} = require("./verifyToken");


const getItems = async function(req, res, slug){
    if (!verifyToken(req)) {
        return res.status(401).json(message.response("Unauthorized", {})); 
    }

    var params= req.query;
    const api = axios.create({baseURL: "https://app.ticketmaster.com/discovery/v2/",responseType: 'json'});
    params['apikey']=secrets.ticket_master_api_key;

    try {
        const res2 = await api.get(slug,{ params })
        if (res2.data){
            var output=[]
            var venues;
            if (res2.data._embedded && res2.data._embedded.venues){
                venues=res2.data._embedded.venues;
            } else{
                venues=[res2.data];
            }
            for (var venue of venues){
                var map_item={};
                map_item['location']=venue.location                
                map_item['id']=venue.id
                map_item['name']=venue.name
                output.push(map_item)
            }
            res.status(200).send(message.response("Ok", output));
        } else{
            res.status(500).send(message.response("Error", "Server temporarily down"));
        }

    } catch (err){
        res.status(404).send(message.response("Error", err.message));
    }

}

const getMap = function(req, res) {
    const slug='venues.json'
    getItems(req,res,slug)
}

exports.getMap = getMap;