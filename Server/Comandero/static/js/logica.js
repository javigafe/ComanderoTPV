var app = angular.module('emp', []);
app.controller("empController", function($scope) {

    $scope.save = function () {
        if (!$scope.nom)
        {
            alert("Introdueix el nom");
        }
        else if (!$scope.preu)
        {
            alert("Introduce el precio de venta");
        }
        else {
            //$scope.productos.push({ 'nombre': $scope.nombre, 'precioV': $scope.precioV, 'precioC': $scope.precioC, 'tipo': $scope.tipo, 'cContable': $scope.cContable, 'uDefecto': $scope.uDefecto, 'vendible': $scope.vendible, 'comprable': $scope.comprable });
            $scope.nom = '';
            $scope.preu = '';

        }
    };


});
