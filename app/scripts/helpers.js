  function SetupDialogController($scope, $shared, Backend, title, category, $mdDialog, onSuccess, onError) {
        $scope.values = {
      name: title,
      category: category
    };
    $scope.templates = [];
    $scope.step = 1;
    $scope.blankTemplate = {
      "title": "Blank Template",
      "id": null
    };
    $scope.templates = [];

    $scope.canShowPreset = function(preset) {
      var show = false;
      var presets = $scope.presets;
      if (preset.depends_on_field !== '') {
        for ( var index in presets ) {
          var obj = presets[ index ];
          if ( preset.depends_on_field === obj.var_name ) {
            if (obj.value === preset.depends_on_value ) {
              show = true;
            }
          }
        }
      } else {
        show = true;
      }
      return show;
    }
    $scope.cancel = function() {
      $mdDialog.hide();
    }



    function init() {
      $shared.isLoading = true;
      var templateByCategory;
      Backend.get("/flow/listTemplates").then(function (res) {
        $shared.isLoading = false;
        console.log("flow templates are ", res.data);
        var templates = res.data.data;
        $scope.templates = templates;
        var templatesByCategory = [];
        for ( var index in templates ) {
          var template = templates[ index ];
          var category = templatesByCategory[ template.category ];
          var found = false;
          for (var index1 in templatesByCategory ) {
              if (templatesByCategory[index1].name === template.category) {
                found = true;
                templateByCategory = templatesByCategory[index1];
              }
          }
          if ( !found ) {
            templatesByCategory.push({
              "name": template.category,
              "templates": [template]
            });
            continue;
          }
          templateByCategory['templates'].push( template );
        }
        $scope.templatesByCategory = templatesByCategory;
        console.log("template ", templatesByCategory);
      });

    }
    $scope.save = function() {
      if ( $scope.step === 1 ) {
        $scope.saveStep1();
      } else if ( $scope.step === 2 ) {
        $scope.saveStep2();
      }
    }
    $scope.saveStep1 = function () {
      var data = angular.copy($scope.values);
      var templateByCategory;
      data['flow_json'] = null;
      data['template_id'] = null;
      data['started'] = true;
      data['category'] = $scope.values['category'];
      if ($scope.selectedTemplate.name !== 'Blank') {
        data['template_id'] = $scope.selectedTemplate.id;
      }
      $shared.isCreateLoading = true;
      Backend.post("/flow/saveFlow", data).then(function (res) {
        $shared.isCreateLoading = false;
        console.log("response arguments ", arguments);
        console.log("response headers ", res.headers('X-Flow-ID'));
        console.log("response body ", res.body);
        var id = res.headers('X-Flow-ID');
        $scope.flowId = id;
        var urlObj = URI(document.location.href);
        var query = urlObj.query(true);
        var token = query.auth;

        Backend.get("/getFlowPresets?templateId=" + data['template_id']).then(function (res) {
          if ( !res.data.has_presets ) {
            return;
          } 
          var url = "/getFlowPresets?templateId=" + data['template_id'];
          $scope.inputs = {};
          Backend.get(url).then(function (res) {
            console.log("presets are ", res.data);
            $scope.presets = res.data.presets;
            angular.forEach($scope.presets, function(preset) {
              preset.value = preset.default;
            });
            $scope.step = 2;
          });
        });

      });
    }
    $scope.useTemplate = function (template) {
      $scope.selectedTemplate = template;
    };
    $scope.isSelected = function (template) {
      if ($scope.selectedTemplate && template.id === $scope.selectedTemplate.id) {
        return true;
      }
      return false;
    }

    $scope.saveStep2 = function() {
        var url = "/saveUpdatedPresets?templateId=" + $scope.selectedTemplate.id + "&flowId=" + $scope.flowId;
        var presets = angular.copy( $scope.presets );

        var data = presets.map(function(preset) {
          return {
            widget: preset.widget,
            widget_key: preset.widget_key,
            value: preset.value
          };
        });

        $shared.isLoading = true;
        Backend.post(url, data).then(function (res) {
          console.log("updated presets..");
          onSuccess($scope.flowId);
        });
    }

    init();

  }