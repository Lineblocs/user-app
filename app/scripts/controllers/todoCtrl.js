'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
 angular.module('MaterialApp').controller('todoCtrl', function ($scope) {
 	$scope.todos = [
 	{text:'Meeting with Nabindar Singh.', done:false, id: 'option1'}, 
 	{text:'Exercise at 6:pm with Nicholas.', done:false, id: 'option3'},         
 	{text:'Avengers Age of Ultron.', done:false, id: 'option4'},         
 	{text: 'Henna birthday at Mezbaan.', done:false, id: 'option5'}
 	];
 	function makeid()
 	{
 		var text = "";
 		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

 		for( var i=0; i < 5; i++ )
 			text += possible.charAt(Math.floor(Math.random() * possible.length));

 		return text;
 	}
 	$scope.addTodo = function () {
 		$scope.todos.push({text:$scope.formTodoText, done:false, id:makeid()});
 		$scope.formTodoText = '';
 	};
 });