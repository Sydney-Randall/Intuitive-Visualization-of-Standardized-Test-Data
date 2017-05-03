import { Component, Input } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Teacher, TEACHERS }  from './teacher';
import { Student, STUDENTS } from './student';
import { Test, TESTS, StudentTESTS, ClassTESTS } from './tests';
import { StudentService} from './student.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

// Add graphing here

@Component({
    selector: 'my-graphs',
    template: `
        <div *ngIf="currentStudent">
          <h2>{{currentStudent.firstName}} {{currentStudent.lastName}}</h2>
          <div>
            <label>ID: </label>{{currentStudent.id}}
            <br>
            <label>Current Grade: </label>{{currentStudent.reportingGrade}}
          </div>
        </div>
        <h4>Standardized Test Results</h4>
        <ul class="tests">
            <li *ngFor="let test of tests">
                {{test.desc}} {{test.abbreviation}} {{test.taken}}
                <br>
                {{test.score}} / {{test.maxScore}} : {{test.percentage}}
                <br>
                Class Average : {{test.classAverage}}
                <br>
                School Average : {{test.schoolAverage}}
            </li>
        </ul>
        `
})
export class GraphComponent {
    tests = StudentTESTS;
    currentStudent: Student;
    id: string;
    
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private service: StudentService) {

        this.route.params.subscribe(params => {
            this.id = params['id'];
        });
    }

    ngOnInit() {
        this.currentStudent = this.service.getStudent(this.id);
    }
}