angular
  .module('tas', ['ngRoute'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/tas', {
        templateUrl: 'views/table.html',
        controller: 'TasController',
        controllerAs: 'tas'
      })
      .when('/tas/new', {
        templateUrl: 'views/form.html',
        controller: 'TasController',
        controllerAs: 'tas'
      })
      .when('/tas/:uuid', {
        templateUrl: 'views/show.html',
        controller: 'ShowController',
        controllerAs: 'show'
      })
      .when('/tas/:uuid/edit', {
        templateUrl: 'views/form.html',
        controller: 'EditController',
        controllerAs: 'tas'
      })
      .otherwise({
        redirectTo: '/tas'
      })
  })
  .service('taFactory', function ($http) {
    var tas = {},
        FIREBASE_URL = 'https://angularpracticeecb.firebaseio.com';

    tas.findOne = function (id, cb) {
      $http
        .get(FIREBASE_URL + '/tas/' + id + '.json')
        .success(function (data) {
          cb(data);
        });
    };

    tas.findAll = function (cb) {
      $http
        .get(FIREBASE_URL + '/tas.json')
        .success(function (data) {
          cb(data);
        });
    };

    tas.create = function (data, cb) {
      $http
        .post(FIREBASE_URL + '/tas.json', data)
        .success(function (res) {
          cb(res);
        });
    };

    tas.update = function (id, data, cb) {
      var url = FIREBASE_URL + '/tas/' + id + '.json';

      $http
        .put(url, data)
        .success(function (res) {
          if (typeof cb === 'function') {
            cb(res);
          }
        });
    };

    tas.delete = function (id, cb) {
      var url = FIREBASE_URL + '/tas/' + id + '.json';

      $http
        .delete(url)
        .success(function () {
          cb();
        });
    };

    return tas;
  })
  .controller('EditController', function ($routeParams, $location, taFactory) {
    var vm = this,
        id = $routeParams.uuid;

    taFactory.findOne(id, function (ta) {
      vm.newTA = ta;
    })

    vm.cohortOptions = [
      'N/A',
      'One',
      'Two',
      'Three',
      'Four',
      'Five',
      'Six',
      'Seven',
      'Eight',
      'Nine',
      'Ten'
    ];

    vm.addOrEditTA = function () {
      // $http
      //   .put('https://mytas.firebaseio.com/tas/' + id + '.json',
      //     vm.newTA
      //   )
      //   .success(function (data) {
      //     $location.path('/tas')
      //   });

      taFactory.update(id, vm.newTA, function () {
        $location.path('/tas')
      })

    };

  })
  .controller('ShowController', function ($routeParams, taFactory) {
    var vm = this,
        id = $routeParams.uuid;

    taFactory.findOne(id, function (ta) {
      vm.ta = ta;
    });
  })
  .controller('TasController', function ($location, taFactory) {
    var vm = this;

    vm.cohortOptions = [
      'N/A',
      'One',
      'Two',
      'Three',
      'Four',
      'Five',
      'Six',
      'Seven',
      'Eight',
      'Nine',
      'Ten'
    ];

    taFactory.findAll(function (tas) {
      vm.data = tas;
    })

    vm.addOrEditTA = function () {
      vm.newTA.name = 'Adam';
      vm.newTA.nickName = vm.newTA.firstName[0].toUpperCase() + 'Adam';

      taFactory.create(vm.newTA, function (res) {
        vm.data[res.name] = vm.newTA;
        $location.path('/tas');
      });
    };

    vm.removeTA = function (id) {
      taFactory.delete(id, function () {
        delete vm.data[id];
      });
    };

    vm.updateTA = function (id) {
      taFactory.update(id, vm.data[id]);
    };

  });
