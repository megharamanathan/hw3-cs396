"use strict";

const resetDB = require("../config/scripts/populateDB")

const Companion = require("./schema/Companion");
const Doctor = require("./schema/Doctor");

const express = require("express");
const router = express.Router();


// completely resets your database.
// really bad idea irl, but useful for testing
router.route("/reset")
    .get((_req, res) => {
        resetDB(() => {
            res.status(200).send({
                message: "Data has been reset."
            });
        });
    });

router.route("/")
    .get((_req, res) => {
        console.log("GET /");
        res.status(200).send({
            data: "App is running."
        });
    });
    
// ---------------------------------------------------
// Edit below this line
// ---------------------------------------------------
router.route("/doctors")
    .get((req, res) => {
        console.log("GET /doctors");

        // already implemented:
        Doctor.find({})
            .sort('ordering')
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(404).send(err);
            });
    })
    .post((req, res) => {
        console.log("POST /doctors");
        
        if (req.body.name && req.body.seasons)
        {
            Doctor.create(req.body).save()
            .then(doctor => {
                res.status(201).send(doctor)
            })
        }
        else
        {
            res.status(500).send("Bad Data")
        }
    });

// optional:
router.route("/doctors/favorites")
    .get((req, res) => {
        console.log(`GET /doctors/favorites`);
        res.status(501).send();
    })
    .post((req, res) => {
        console.log(`POST /doctors/favorites`);
        res.status(501).send();
    });
    
router.route("/doctors/:id")
    .get((req, res) => {
        console.log(`GET /doctors/${req.params.id}`);
        
        Doctor.findById(req.params.id)
        .sort('ordering')
        .then(doctor => {
            res.status(200).send(doctor)
        })
        .catch(err => {
            res.status(404).send({"message":"Doctor with id " + req.params.id + " does not exist in your favorites."})
        })
    })
    .patch((req, res) => {
        console.log(`PATCH /doctors/${req.params.id}`);
        
        Doctor.findOneAndUpdate({_id: req.params.id}, req.body, { new: true })
        .sort('ordering')
        .then(doctor => {
            res.status(200).send(doctor)
        })
        .catch(err => {
            res.status(404).send({"message":"Doctor with id " + req.params.id + " does not exist in your favorites."})
        })
    })
    .delete((req, res) => {
        console.log(`DELETE /doctors/${req.params.id}`);
        
        Doctor.findOneAndDelete({ _id: req.params.id })
        .sort('ordering')
        .then(doctor => {
            res.status(200).send(null)
        })
        .catch(err => {
            res.status(404).send({"message":"Doctor with id " + req.params.id + " does not exist in your favorites."})
        })
    });
    
router.route("/doctors/:id/companions")
    .get((req, res) => {
        console.log(`GET /doctors/${req.params.id}/companions`);
        
        Companion.find({ doctors: {$all: [req.params.id]} })
        .sort('ordering')
        .then(companion => {
                res.status(200).send(companion); 
        })
        .catch(err => {
            res.status(404).send({"message":"Doctor with id " + req.params.id + " does not exist in your favorites."})
        })
    });
    

router.route("/doctors/:id/goodparent")
    .get((req, res) => {
        console.log(`GET /doctors/${req.params.id}/goodparent`);

        var allAlive = true; 
        
        Companion.find({doctors: {$all: [req.params.id]}})
        .sort('ordering')
        .then(companions => {
            companions.forEach(function(companion) {
                if (companion.alive === false)
                {
                    allAlive = false; 
                }
            })

            if (allAlive) 
            {
                res.status(200).send(true)
            }
            else {
                res.status(200).send(false)
            }
        })
        .catch(err => {
            res.status(404).send({"message":"Doctor with id " + req.params.id + " does not exist in your favorites."})
        })
    });

// optional:
router.route("/doctors/favorites/:doctor_id")
    .delete((req, res) => {
        console.log(`DELETE /doctors/favorites/${req.params.doctor_id}`);
        res.status(501).send();
    });

router.route("/companions")
    .get((req, res) => {
        console.log("GET /companions");
        // already implemented:
        Companion.find({})
        .sort('ordering')
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(404).send(err);
            });
    })
    .post((req, res) => {
        console.log("POST /companions");
        
        if (req.body.name && req.body.character && req.body.doctors && req.body.seasons && typeof req.body.alive !== 'undefined')
        {
            Companion.create(req.body).save()
            .then(companion => {
                res.status(201).send(companion)
            })
        }
        else
        {
            res.status(500).send("Bad Data")
        }
    });

router.route("/companions/crossover")
    .get((req, res) => {
        console.log(`GET /companions/crossover`);
        
        Companion.find({"doctors.1": {$exists: true}})
        .sort('ordering')
        .then(companions => {
            res.status(200).send(companions)
        })
    });

// optional:
router.route("/companions/favorites")
    .get((req, res) => {
        console.log(`GET /companions/favorites`);
        res.status(501).send();
    })
    .post((req, res) => {
        console.log(`POST /companions/favorites`);
        res.status(501).send();
    })

router.route("/companions/:id")
    .get((req, res) => {
        console.log(`GET /companions/${req.params.id}`);
        
        Companion.findById(req.params.id)
        .sort('ordering')
        .then(companion => {
                res.status(200).send(companion)
        })
        .catch(err => {
            res.status(404).send({"message":"Companion with id " + req.params.id + " does not exist in your favorites."})
        })
    })
    .patch((req, res) => {
        console.log(`PATCH /companions/${req.params.id}`);
        
        Companion.findOneAndUpdate({_id: req.params.id}, req.body, { new: true })
        .sort('ordering')
        .then(companion => {
            console.log(companion)
            res.status(200).send(companion)
        })
        .catch(err => {
            res.status(404).send({"message":"Companion with id " + req.params.id + " does not exist in your favorites."})
        })
    })
    .delete((req, res) => {
        console.log(`DELETE /companions/${req.params.id}`);
        
        Companion.findOneAndDelete({ _id: req.params.id })
        .sort('ordering')
        .then(companion => {
            res.status(200).send(null)
        })
        .catch(err => {
            res.status(404).send({"message":"Companion with id " + req.params.id + " does not exist in your favorites."})
        })
    });

router.route("/companions/:id/doctors")
    .get((req, res) => {
        console.log(`GET /companions/${req.params.id}/doctors`);

        Companion.findById(req.params.id)
        .sort('ordering')
        .then(companion => {
            Doctor.find({
                '_id': {
                    $in: companion.doctors
                }
            })
            .sort('ordering')
            .then(doctors => {
                res.status(200).send(doctors)
            })
        })
        .catch(err => {
            res.status(404).send({"message":"Companion with id " + req.params.id + " does not exist in your favorites."})
        })
    });

router.route("/companions/:id/friends")
    .get((req, res) => {
        console.log(`GET /companions/${req.params.id}/friends`);
        
        Companion.findById(req.params.id)
        .sort('ordering')
        .then(companion => {
            Companion.find({'seasons': {$in: companion.seasons }})
            .sort('ordering')
            .then(companions => {
                var filtered = companions.filter(function(value){
                    return value._id != req.params.id
                })
                res.status(200).send(filtered)
            })
        })
        .catch(err => {
            res.status(404).send({"message":"Companion with id " + req.params.id + " does not exist in your favorites."})
        })
    });

// optional:
router.route("/companions/favorites/:companion_id")
    .delete((req, res) => {
        console.log(`DELETE /companions/favorites/${req.params.companion_id}`);
        res.status(501).send();
    });

module.exports = router;