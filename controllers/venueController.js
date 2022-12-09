
var secrets = require('../config/secrets');
var mongoose = require('mongoose');
var axios =require('axios');
var message = require('../models/message');
var reviewModel = require("../models/review");
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
                var myvenue={};

                myvenue['name']=venue.name
                myvenue['location']=venue.location
                myvenue['id']=venue.id
                myvenue['event_ids']=await getVenueEvents(venue.id)
                
                var reviews = await reviewModel.review.find({"venue_id": venue.id},{"_id": 1}) //to be changed to venue query after caching
                myvenue['review_ids'] = reviews.map(e=>e.id)
                
                var ratings=reviews.map(e=>e.rating)
                var avg_rating;
                ratings.length===0 ? avg_rating = 0 : avg_rating = ratings.reduce((a, b) => a + b, 0) / ratings.length
                myvenue['avg_rating'] = avg_rating

                output.push(myvenue)
                //await rate_limit_helper()
            }
            res.status(200).send(message.response("Ok", output));

        } else {
            res.status(500).send(message.response("Error", "Server temporarily down"));
        }

    } catch (err){
        res.status(404).send(message.response("Error", err.message));
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
    if (!verifyToken(req)) {
        return res.status(401).json(message.response("Unauthorized", {})); 
    }

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


