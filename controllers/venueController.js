
var secrets = require('../config/secrets');
var mongoose = require('mongoose');
var axios =require('axios');
var message = require('../models/message');


const getItems = async function(req, res, slug){
    var params= req.query;
    const api = axios.create({baseURL: "https://app.ticketmaster.com/discovery/v2/",responseType: 'json'});
    params['apikey']=secrets.ticket_master_api_key;
    
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
            var myvenue={};

            myvenue['name']=venue.name
            myvenue['location']=venue.location
            myvenue['id']=venue.id
            myvenue['event_ids']=await getVenueEvents(venue.id)
            output.push(myvenue)
            await rate_limit_helper()
            //reviews id list
            //myvenue['rating']= get from database
            
        }
        res.status(200).send(message.response("Ok", output));
    }
}

const getVenueList = function(req, res) {
    const slug='venues.json'
    getItems(req,res,slug)
}

const getVenue = function(req, res) {
    const id = req.params.id
    const slug='venues/'.concat(id).concat('.json')
    getItems(req,res,slug)
}

const rate_limit_helper = () =>
  new Promise(resolve =>
    setTimeout(() => resolve(), 60)
  );


const getVenueEvents = async function(venu_id) {
    var params={}
    const api = axios.create({baseURL: "https://app.ticketmaster.com/discovery/v2/",responseType: 'json'});
    const slug='events.json'
    params['apikey']=secrets.ticket_master_api_key;
    params['venueId']=venu_id

    // const res = await 
    api.get(slug,{ params }).then(
        (response) => {
            var event_ids=[];
            if (res.data){
                console.log("RESPONSE:",res.data);
                var events=res.data._embedded.events
                for (var event of events){
                    event_ids.push(event.id)
                }
            }
            return event_ids;
        }).catch(
        (error) => {
            console.log("ERROR", error);
            return [];
        });  
}






exports.getVenueList = getVenueList;
exports.getVenue = getVenue;
exports.getVenueEvents = getVenueEvents


