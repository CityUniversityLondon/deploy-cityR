$(function () {

        var log = function (m) {
                $('#log').append($('<div></div>').html(m));
            },

            jsApi = new Squiz_Matrix_API({key: '7890436533'}),

            defaultBanner = false,

            assets = {},


        /*createFolder = function(country, done) {
         jsApi.createAsset({
         "parent_id":country.asset_id,
         "type_code":"folder",
         "asset_name":"banner",
         "link_type":2,
         "link_value":"banner",
         "extra_attributes":1,
         "attributes":"web_path=",
         "dataCallback":function (data) {
         if (data.id) {
         log('folder created for ' + country.name);
         assets[country.asset_id].f = data.id;
         } else {
         log('error creating folder for ' + country.name);
         }
         done();
         }
         });
         },


         findFolder = function(country, done) {
         assets[country.asset_id] = {f: false, b: false};
         log('checking folder for ' + country.name);
         jsApi.getChildren({
         asset_id: country.asset_id,
         levels: 1,
         type_codes: ['folder'],
         link_values: ['banner'],
         dataCallback : function (folderData) {

         if (folderData.length === 0 || folderData.error) {
         log('create folder for ' + country.name);
         createFolder(country, done);
         } else {
         log('folder exists for ' + country.name);
         assets[country.asset_id].f = folderData[0].asset_id;
         done();
         }
         }
         });280414
         },*/

            createDefaultBannerLinks = function () {
                var db = 280414,
                    batch = {};

                for (var i in assets) {
                    if (assets.hasOwnProperty(i) && assets[i].f) {
                        batch[i] = {
                            "function": "createLink",
                            "args": {
                                "parent_id": assets[i].f,
                                "child_id": 280414,
                                "link_type": 1,
                            }
                        }
                    }
                }

                jsApi.batchRequest({
                    functions: batch,
                    "dataCallback": function (data) {
                        console.log(data);
                    }
                });
            },

            setFoldersLive = function () {
                var batch = {};
                for (var i in assets) {
                    if (assets.hasOwnProperty(i)) {

                        batch[i] = {
                            "function": "setAssetStatus",
                            "args": {
                                asset_id: assets[i].f,
                                status: 16,
                                "cascade": 0
                            }
                        }
                    }
                }

                jsApi.batchRequest({
                    functions: batch,
                    "dataCallback": function (data) {
                        console.log(data);
                    }
                });
            },

            createFolders = function (missing) {
                var batch = {};

                for (var i = 0; i < missing.length; i++) {
                    batch[i] = {
                        "function": "createAsset",
                        "args": {
                            "parent_id": assets[missing[i]].c,
                            "type_code": "folder",
                            "asset_name": "banner",
                            "link_type": 2,
                            "link_value": "banner",
                            "extra_attributes": 1,
                            "attributes": "web_path="
                        }
                    };
                }

                jsApi.batchRequest({
                    functions: batch,
                    "dataCallback": function (data) {
                        console.log(data);
                    }

                });
            },

            processFolders = function (folderData) {
                var missing = [];
                for (var i = 0; i < folderData.length; i++) {
                    var cid = assets[i].c,
                        hf = folderData[i].length > 0;

                    if (hf) {
                        assets[i].f = folderData[i][0].asset_id;
                    } else {
                        missing.push(i);
                    }
                }

                if (missing.length > 0) {
                    console.log('missing folders:', missing);
                    createFolders(missing);
                } else {
                    console.log('no missing!');
                    //setFoldersLive();
                    createDefaultBannerLinks();
                }
            },

            findFolders = function (countries) {
                var batch = {};
                for (var i = 0; i < countries.length; i++) {
                    assets[i] = {
                        c: countries[i].asset_id,
                        f: false,
                        b: false
                    };

                    batch[i] = {
                        "function": "getChildren",
                        "args": {
                            asset_id: countries[i].asset_id,
                            levels: 1,
                            type_codes: ['folder'],
                            link_values: ['banner']
                        }
                    }
                }

                jsApi.batchRequest({
                    functions: batch,
                    "dataCallback": processFolders
                });
            },


            processChildren = function (data) {
                findFolders(data);
            };


        jsApi.getChildren({
            asset_id: 265691,
            levels: 1,
            type_codes: ['page_standard'],
            link_types: ['SQ_LINK_TYPE_1', 'SQ_LINK_TYPE_2'],
            dataCallback: processChildren
        });
    }
)
;
