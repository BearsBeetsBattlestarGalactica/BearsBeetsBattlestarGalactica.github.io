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
            id: "OECD_GHG_Emissions",
            alias: "GHG Emissions",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    myConnector.getData = function (table, doneCallback) {

        $.getJSON("https://stats.oecd.org/SDMX-JSON/data/AIR_GHG/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OECDAO+EU28+OECDE+OECD+NMEC+ARG+BRA+CHN+COL+CRI+IND+IDN+RUS+ZAF+OECDAM.GHG.TOTAL+ENER+ENER_IND+ENER_MANUF+ENER_TRANS+ENER_OSECT+ENER_OTH+ENER_FU+ENER_CO2+IND_PROC+AGR+WAS+OTH+LULUCF+AFOLU+TOTAL_LULU/all?startTime=1990&endTime=2016&dimensionAtObservation=allDimensions", function (resp) {
            var obsvs = resp.dataSets[0].observations,
                tableData = [],
                i = 0,
                arrKey;

            for (i = 0, len = Object.keys(obsvs).length; i < len; i++) {
                arrKey = Object.keys(obsvs)[i].split(':');
                tableData.push({
                    "cou": resp.structure.dimensions.observation[0].values[arrKey[0]].name,
                    "pol": resp.structure.dimensions.observation[1].values[arrKey[1]].name,
                    "vari": resp.structure.dimensions.observation[2].values[arrKey[2]].name,
                    "time": resp.structure.dimensions.observation[3].values[arrKey[3]].name,
                    "obs": obsvs[Object.keys(obsvs)[i]][0]
                });
            }

            table.appendRows(tableData);
            doneCallback();
        });

    };

    tableau.registerConnector(myConnector);

    $(document).ready(function () {
        $("#submitButton").click(function () {
            tableau.connectionName = "OECD Greenhouse Gas Emissions";
            tableau.submit();
        });
    });

})();
