function ListCtrl($scope) {

    $scope.codelist = [];
    $scope.codes = {};

    $scope.severityList = [];
    $scope.severities = {};

    $.ajax({
        url: 'https://data.illinois.gov/api/views/53fr-di76/rows.json?accessType=DOWNLOAD',
        type: 'get',
        cache: false,
        timeout: 30000,
        success: function (data) {
            for (var i = 0; i < data.data.length; i++) {
                var address = data.data[i][15];
                var info = getInfo(data.data[i]);
                if (!$scope.codes[data.data[i][10]]) {
                    $scope.codes[data.data[i][10]] = data.data[i][11];
                    $scope.codelist[$scope.codelist.length] = { code: data.data[i][10], name: data.data[i][11] };
                }
            }
            $scope.$apply();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("error getting data", xhr.responseText);
        }
    });


    $.ajax({
        url: '/api/ServiceRequest',
        type: 'get',
        cache: false,
        timeout: 30000,
        success: function (data) {
            for (var i = 0; i < data.length; i++) {

                if (severities[data[i].Severity]) {
                    $scope.severities[data[i].Severity] = data[i].Severity;
                    $scope.severityList[$scope.severityList.length] = { code: data[i].Severity, name: data[i].Severity };
                }
                $scope.$apply();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("error getting data", xhr.responseText);
        }
    });
}