"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var tests_1 = require('./tests');
var student_service_1 = require('./student.service');
var router_1 = require('@angular/router');
// Add graphing here
var GraphComponent = (function () {
    function GraphComponent(route, router, service) {
        var _this = this;
        this.route = route;
        this.router = router;
        this.service = service;
        this.tests = tests_1.StudentTESTS;
        this.route.params.subscribe(function (params) {
            _this.id = params['id'];
        });
    }
    GraphComponent.prototype.ngOnInit = function () {
        this.currentStudent = this.service.getStudent(this.id);
    };
    GraphComponent = __decorate([
        core_1.Component({
            selector: 'my-graphs',
            template: "\n        <div *ngIf=\"currentStudent\">\n          <h2>{{currentStudent.firstName}} {{currentStudent.lastName}}</h2>\n          <div>\n            <label>ID: </label>{{currentStudent.id}}\n            <br>\n            <label>Current Grade: </label>{{currentStudent.reportingGrade}}\n          </div>\n        </div>\n        <h4>Standardized Test Results</h4>\n        <ul class=\"tests\">\n            <li *ngFor=\"let test of tests\">\n                {{test.desc}} {{test.abbreviation}} {{test.taken}}\n                <br>\n                {{test.score}} / {{test.maxScore}} : {{test.percentage}}\n                <br>\n                Class Average : {{test.classAverage}}\n                <br>\n                School Average : {{test.schoolAverage}}\n            </li>\n        </ul>\n        "
        }), 
        __metadata('design:paramtypes', [router_1.ActivatedRoute, router_1.Router, student_service_1.StudentService])
    ], GraphComponent);
    return GraphComponent;
}());
exports.GraphComponent = GraphComponent;
//# sourceMappingURL=graph.component.js.map