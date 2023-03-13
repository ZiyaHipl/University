import React from 'react';
import Config from '../../Lib/Config';

export default class StripeHelper extends React.Component {
    static addNewCard = async (data, stripe_customer_id) => {
        let finalUrl = `${Config.STRIPE_BASE_URL}${stripe_customer_id}/sources`;
        let responsedata = await this.makeRequest({ url: finalUrl, data: data, token: Config.STRIPE_SECRET_KEY, method: "POST" }).then((response) => {
            return response;
        }).catch(err => {
            return err;
        })
        return responsedata;
    }

    static getSavedCards = async (data, stripe_customer_id) => {
        let finalUrl = `${Config.STRIPE_BASE_URL}${stripe_customer_id}/sources?object=card&limit=30`;

        let responsedata = await this.makeRequest({ url: finalUrl, data: data, token: Config.STRIPE_SECRET_KEY, method: "GET" }).then((response) => {
            return response;
        }).catch(err => {
            return err;
        })

        console.log('getSavedCards-----------', responsedata)
        return responsedata;
    }

    static deleteSavedCards = async (stripe_customer_id, card_token) => {
        let finalUrl = `${Config.STRIPE_BASE_URL}${stripe_customer_id}/sources/${card_token}`;

        let responsedata = await this.makeRequest({ url: finalUrl, token: Config.STRIPE_SECRET_KEY, method: "DELETE" }).then((response) => {
            return response;
        }).catch(err => {
            return err;
        })
        return responsedata;
    }

    static checkCardId = async (data, stripe_customer_id, card_id) => {
        let finalUrl = `${Config.STRIPE_BASE_URL}${stripe_customer_id}/sources/` + card_id;

        console.log('checkCardId---------', finalUrl)
        let responsedata = await this.makeRequest({ url: finalUrl, data: data, token: Config.STRIPE_SECRET_KEY, method: "GET" }).then((response) => {
            return response;
        }).catch(err => {
            return err;
        })
        return responsedata;
    }


    static async makeRequest({ url, data, token, method = "POST", loader = true }) {
        // console.log(url, "-----------finalUrl" + token);
        var form;
        let varheaders;
        let methodnew;
        if (method == "POST") {
            methodnew = "POST";
            varheaders = {
                'Content-Type': 'application/x-www-form-urlencoded',
                "Authorization": 'Bearer ' + token
            }
            form = []
            for (var property in data) {
                var encodedKey = encodeURIComponent(property);
                var encodedValue = encodeURIComponent(data[property]);
                form.push(encodedKey + "=" + encodedValue);
            }
            form = form.join("&");
        } else if (method == "DELETE") {
            methodnew = "DELETE";
            varheaders = {
                'Content-Type': 'application/x-www-form-urlencoded',
                "Authorization": 'Bearer ' + token
            }
            form = []
            for (var property in data) {
                var encodedKey = encodeURIComponent(property);
                var encodedValue = encodeURIComponent(data[property]);
                form.push(encodedKey + "=" + encodedValue);
            }
            form = form.join("&");
        }
        else {
            methodnew = "GET";
            varheaders = {
                'Content-Type': 'application/x-www-form-urlencoded',
                "Authorization": 'Bearer ' + token
            }
        }
        return await fetch(url, {
            body: form,
            method: methodnew,
            headers: varheaders,
        })
            .then((response) => {
                return response.json()
            })
            .then((responseJson) => {
                return responseJson;
            })
            .catch((error, a) => {
            });
    }
}