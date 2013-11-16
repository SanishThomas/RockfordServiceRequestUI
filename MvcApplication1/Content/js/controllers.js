function ListCtrl($scope) {
    $scope.listitems = [{
        Name: 'test1'
    }, {
        Name: 'test2'
    }, {
        Name: 'test3'
    }];

    $scope.clickListItem = function (idx) {
        console.log(idx);
    }
}