MinStrengthDirective = ($parse) ->
  directive =
    require: "?ngModel"
    restrict: "A"
    link: (scope, elem, attrs, ctrl) ->
      minStrengthGetter = $parse attrs.minStrength
      
      scope.$watch getMinStrengthValue, ->
        ctrl.$$parseAndValidate()

      ctrl.$validators.minStrength = ->
        minStrength = getMinStrengthValue()
        if ctrl.$viewValue?
          pwStrength = zxcvbn ctrl.$viewValue
          return pwStrength.score >= minStrength
      
      getMinStrengthValue = ->
        minStrength = minStrengthGetter scope
        if angular.isObject minStrength and minStrength.hasOwnProperty "$viewValue"
          minStrength = minStrength.$viewValue
        return minStrength

angular
  .module "nickel.minStrength", []
  .directive "minStrength", MinStrengthDirective
