// taken from: http://stackoverflow.com/questions/15417125/submit-form-on-pressing-enter-with-angularjs
//changed from ngEnter to Enter to prevent future conflict with Angular's native directives

angular.module('yourModuleName').directive('Enter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if(event.which === 13) {
                scope.$apply(function(){
                    scope.$eval(attrs.Enter, {'event': event});
                });

                event.preventDefault();
            }
        });
    };
});
