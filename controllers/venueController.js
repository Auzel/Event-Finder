
var secrets = require('../config/secrets');
var mongoose = require('mongoose');
var axios =require('axios');
var message = require('../models/message');
var reviewModel = require("../models/review")


const getItems = async function(req, res, slug){
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
                output.push(myvenue)
                //const review_ids= await reviewModel.find({"venue_id": venue.id},{"_id": 0})
                
                /*
                query.exec(function (err, ids) {
                    if (err) return res.status(500).json(message.response("System error", {}));
                    if(COUNT) {item=item.length};
                    var output_obj=create_return_obj("OK",item)
                    return res.status(200).json(output_obj)
                });
                */
            
        
                await rate_limit_helper()
                //reviews id list
                //myvenue['rating']= get from database
                
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
    var params={}
    const api = axios.create({baseURL: "https://app.ticketmaster.com/discovery/v2/",responseType: 'json'});
    const slug='events.json'
    params['apikey']=secrets.ticket_master_api_key;
    params['venueId']=venu_id

    const res = await api.get(slug,{ params })
  
    var event_ids=[]
    if (res.data){
        var events=res.data._embedded.events
        for (var event of events){
            event_ids.push(event.id)
        }
    }
    return event_ids;
}






exports.getVenueList = getVenueList;
exports.getVenue = getVenue;
exports.getVenueEvents = getVenueEvents


