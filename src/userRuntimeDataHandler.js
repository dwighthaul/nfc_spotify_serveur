const express = require('express');
const UserDataSpotify = require('./authSpotify');

// Ultérieurement cette classe utilisera Redis afin de stocker dans la ram les données runtime des users connectées
// Pour l'instant elle stocke juste en mémoire runtime dans une map les infos 
class UserRuntimeDataHandler 
{
    constructor() {
        this.userIdToUserSpotifyData = new Map();
    }

    getUserDataSpotify(userId) 
    {
        return this.userIdToUserSpotifyData.get(userId);
    }

    // Quand le user se connecte
    addUser(userId, userDataSpotify)
    {
        this.userIdToUserSpotifyData.set(userId, userDataSpotify);
    }

    // Quand le user se deconnecte ou timeout
    delUser(userId)
    {

    }
    
}

const userRuntimeDataHandler = new UserRuntimeDataHandler();


module.exports = userRuntimeDataHandler
