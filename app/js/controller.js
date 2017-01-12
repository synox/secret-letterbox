var writeApp = angular.module('writeApp', ['flash']);

writeApp.controller('saveMessageCtrl', function ($scope, $http, Flash) {
  var publicKey = window.openpgp.key.readArmored(pub_key);
  $scope.draft = '';
  $scope.loading = false;
  $scope.http_errors = '';
  
  $scope.messages = stash.get('unsent');
  if(!$scope.messages){
      $scope.messages = [];
  }
  
  $scope.sync = function() {
    $scope.loading = true;
    $scope.http_errors = '';
      $http.post('../backend.php', $scope.messages).
      success(function(saved_timestamps, status, headers, config) {
        // to use splice the array must be iterated in reverse order.
        for(var i = $scope.messages.length -1; i >= 0 ; i--){
            if ( $.inArray($scope.messages[i].timestamp, saved_timestamps) != -1 ) {
              $scope.messages.splice(i,1);
            }
        }
        postSync();
        Flash.create('success', "<strong>OK!</strong> Messages saved and synced.");
      }).
      error(function(data, status, headers, config) {
        if(status==0) {
          Flash.create('warning', "<strong>Offline?</strong> Sync failed.");
        } else {
          Flash.create('danger', "<strong>Error while syncing!</strong> Sync did not suceed. Status="+status);
          $scope.http_errors = "Status="+status+' Error: ' + data;
        }
        postSync();
      });
  };;;;
  
  postSync = function() {
    $scope.loading = false;
    stash.set('unsent', $scope.messages);
  };;;;
  
  $scope.addMessage = function(encrypted) {
    $scope.messages.push(  { 'timestamp': new Date().getTime(),
                               'encrypted': encrypted} );
    stash.set('unsent', $scope.messages);
  };;;;
  
  $scope.saveMessage = function() {
        window.openpgp.encryptMessage(publicKey.keys, $scope.draft).then(function(pgpMessage) {
          $scope.addMessage(pgpMessage);
          $scope.draft = '';
          $scope.sync();
         }).catch(function(error) {
           alert('Failed: ' + error);
        });
  }
  
});
