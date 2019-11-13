(function () {
    var myConnector = tableau.makeConnector();

    myConnector.getSchema = function (schemaCallback) {
        var cols = [{
            id: "cou",
            alias: "country",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "pol",
            alias: "pollutant",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "vari",
            alias: "variable",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "time",
            alias: "year",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "obs",
            alias: "observation",
            dataType: tableau.dataTypeEnum.float
        }];

        var tableSchema = {
            id: "test_DB_schema",
            alias: "Laaaaaa",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    myConnector.getData = function (table, doneCallback) {
        // var dateObj = JSON.parse(tableau.connectionData),
        //     dateString = "startTime=" + dateObj.startDate + "&endTime=" + dateObj.endDate,
        //     apiCall = "https://stats.oecd.org/SDMX-JSON/data/AIR_GHG/all?" + dateString + "&dimensionAtObservation=allDimensions&detail=dataonly";

        $.getJSON("https://stats.oecd.org/SDMX-JSON/data/AIR_GHG/all?startTime=1990&endTime=2017&dimensionAtObservation=allDimensions&detail=dataonly", function (resp) {
            var obsvs = resp.dataSets[0].observations,
                tableData = [],
                i = 0,
                arrKey;

            for (i = 0, len = Object.keys(obsvs).length; i < len; i++) {
                // if (i%1000 == 0) {
                //     console.log("Converting, this is no. " + i + " line.");
                // }

                arrKey = Object.keys(obsvs)[i].split(':');
                tableData.push({
                    "cou": resp.structure.dimensions.observation[0].values[arrKey[0]].name,
                    "pol": resp.structure.dimensions.observation[1].values[arrKey[1]].name,
                    "vari": resp.structure.dimensions.observation[2].values[arrKey[2]].name,
                    "time": resp.structure.dimensions.observation[3].values[arrKey[3]].name,
                    "obs": obsvs[Object.keys(obsvs)[i]][0]
                });
            }

            console.log("Convertion done...");

            table.appendRows(tableData);
            doneCallback();
        });

    };

    tableau.registerConnector(myConnector);


    // Create event listeners for when the user submits the form
    // $(document).ready(function() {
    //     $("#submitButton").click(function() {
    //         var dateObj = {
    //             startDate: $('#start-year').val().trim(),
    //             endDate: $('#end-year').val().trim(),
    //         };

    //         // Simple date validation: Call the getDate function on the date object created
    //         function isValidDate(dateStr) {
    //             var d = new Date(dateStr);
    //             return !isNaN(d.getDate());
    //         }

    //         console.log("submit success");

    //         if (isValidDate(dateObj.startDate) && isValidDate(dateObj.endDate)) {
    //             tableau.connectionData = JSON.stringify(dateObj); // Use this variable to pass data to your getSchema and getData functions
    //             tableau.connectionName = "USGS Earthquake Feed"; // This will be the data source name in Tableau
    //             tableau.submit(); // This sends the connector object to Tableau
    //         } else {
    //             $('#errorMsg').html("Enter valid dates. For example, 2016-05-08.");
    //         }
    //     });
    // });

    $(document).ready(function () {
        $("#submitButton").click(function () {
            tableau.connectionName = "OECD Emissions of air pollutants";
            tableau.submit();
        });
    });

})();