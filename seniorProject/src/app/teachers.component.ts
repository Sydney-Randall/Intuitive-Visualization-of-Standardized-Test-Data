﻿import { Component } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router } from '@angular/router';
import { Teacher, TEACHERS }  from './teacher';
import { Student, STUDENTS } from './student';
import { Test, TESTS,ClassTESTS } from './tests';

@Component({
    selector: 'my-teachers',
    template: `
        <ul class="teachers">
            <li *ngFor="let teacher of teachers"
                [class.selected]="teacher === selectedTeacher"
                (click)="onSelectTeacher(teacher)">
                {{teacher.firstName}} {{teacher.lastName}}
            </li>
        </ul>
        `,
    styles: [`
      .selected {
        background-color: #CFD8DC !important;
        color: white;
      }
      .teachers {
        margin: 0 0 2em 0;
        list-style-type: none;
        padding: 0;
        width: 15em;
      }
      .teachers li {
        cursor: pointer;
        position: relative;
        left: 0;
        background-color: #EEE;
        margin: .5em;
        padding: .3em 0;
        height: 1.6em;
        border-radius: 4px;
      }
      .teachers li.selected:hover {
        background-color: #BBD8DC !important;
        color: white;
      }
      .teachers li:hover {
        color: #607D8B;
        background-color: #DDD;
        left: .1em;
      }
      .teachers .text {
        position: relative;
        top: -3px;
      }
      .teachers .badge {
        display: inline-block;
        font-size: small;
        color: white;
        padding: 0.8em 0.7em 0 0.7em;
        background-color: #607D8B;
        line-height: 1em;
        position: relative;
        left: -1px;
        top: -4px;
        height: 1.8em;
        margin-right: .8em;
        border-radius: 4px 0 0 4px;
      }
    `]
})

export class TeacherComponent {
    teachers = TEACHERS;
    selectedTeacher: Teacher;

    //selection for teachers
    onSelectTeacher(teacher: Teacher): void {
        this.selectedTeacher = teacher;
        this.readStudentCsvData();
        this.router.navigate(['/students', teacher.id]);
    }

    //reads teacher data on startup
    ngOnInit(): void {
        this.readTeacherCsvData();
        this.readTestCsvData();
    }

    //get the tests of a certain class into an array
    private getClassTests(): void {
        ClassTESTS.splice(0, ClassTESTS.length);
        for (let i = 0; i < STUDENTS.length; i++) {
            for (let j = 0; j < TESTS.length; j++) {
                if (TESTS[j].id == STUDENTS[i].id) {
                    ClassTESTS.push(TESTS[j]);
                }
            }
        }
    }

    //calculate school average for each test
    private calculateSchoolAVG(): void {
        for (let i = 0; i < TESTS.length; i++) {
            TESTS[i].schoolAverage = 0;
            for (let j = 0; j < TESTS.length; j++) {
                if (TESTS[i].desc == TESTS[j].desc && TESTS[i].abbreviation == TESTS[j].abbreviation && TESTS[i].grade == TESTS[j].grade) {
                    TESTS[i].averageCounter++;
                    TESTS[i].schoolAverage += TESTS[j].percentage;
                }
            }
            TESTS[i].schoolAverage = TESTS[i].schoolAverage / TESTS[i].averageCounter;
            TESTS[i].averageCounter = 0;
        }
    }

    //calculate class average for each test
    private calculateClassAVG(): void {
        for (let i = 0; i < ClassTESTS.length; i++) {
            ClassTESTS[i].classAverage = 0;
            for (let j = 0; j < ClassTESTS.length; j++) {
                if (ClassTESTS[i].desc == ClassTESTS[j].desc && ClassTESTS[i].abbreviation == ClassTESTS[j].abbreviation && ClassTESTS[i].grade == ClassTESTS[j].grade) {
                    ClassTESTS[i].averageCounter++;
                    ClassTESTS[i].classAverage += ClassTESTS[j].percentage;
                }
            }
            ClassTESTS[i].classAverage = ClassTESTS[i].classAverage / ClassTESTS[i].averageCounter;
            ClassTESTS[i].averageCounter = 0;
        }
    }

    csvTeacherUrl: string = 'data/TeacherFields.csv';  // URL to web API
    csvTeacherData: any[] = [];
    csvStudentUrl: string = 'data/StudentFields.csv';  // URL to web API
    csvStudentData: any[] = [];
    csvTestUrl: string = 'data/StudentTestResults.csv';  // URL to web API
    csvTestData: any[] = [];

    constructor(private http: Http, private router: Router) { }

    //function to read teacher data from CSV
    readTeacherCsvData() {
        this.http.get(this.csvTeacherUrl)
            .subscribe(
            data => this.extractTeacherData(data),
            err => this.handleError(err)
            );
    }

    //function to extract teacher data from CSV
    private extractTeacherData(res: Response) {

        TEACHERS.splice(0, TEACHERS.length);

        let csvTeacherData = res['_body'] || '';
        let allTextLines = csvTeacherData.split(/\r\n|\n/);
        let headers = allTextLines[0].split(',');
        let lines: any[] = [];

        for (let i = 0; i < allTextLines.length; i++) {
            // split content based on comma
            let data = allTextLines[i].split(',');
            if (data.length == headers.length) {
                let tarr: any[] = [];
                for (let j = 0; j < headers.length; j++) {
                    tarr.push(data[j]);
                }
                if (i > 0) { //ignore header row
                    let teacher = new Teacher(data[0], data[1], data[2], data[3], data[4], data[5], data[6]);
                    TEACHERS.push(teacher);
                    lines.push(tarr);
                }
            }
        }
        this.csvTeacherData = lines;
    }

    //function to read student data from CSV
    readStudentCsvData() {
        this.http.get(this.csvStudentUrl)
            .subscribe(
            data => this.extractStudentData(data),
            err => this.handleError(err)
            );
    }

    //function to extract student data from CSV
    //only pushes student data into the array if the class ID matches that of the selected teacher
    private extractStudentData(res: Response) {

        STUDENTS.splice(0, STUDENTS.length);

        let csvStudentData = res['_body'] || '';
        let allTextLines = csvStudentData.split(/\r\n|\n/);
        let headers = allTextLines[0].split(',');
        let lines: any[] = [];

        for (let i = 0; i < allTextLines.length; i++) {
            // split content based on comma
            let data = allTextLines[i].split(',');
            if (data.length == headers.length) {
                let tarr: any[] = [];
                for (let j = 0; j < headers.length; j++) {
                    tarr.push(data[j]);
                }
                if (data[6] == this.selectedTeacher.classID) {
                    if (i > 0) { //ignore header row
                        let student = new Student(data[0], data[1], data[2], data[3], data[4], data[5], data[6]);
                        STUDENTS.push(student);
                        lines.push(tarr);
                    }
                }
            }
        }
        this.csvStudentData = lines;

        //force these functions to get called after all the student data has been read in
        //because for whatever reason, it's calling them first if done in onSelectTeacher
        this.getClassTests();
        this.calculateSchoolAVG();
        this.calculateClassAVG();
    }

    //function to read test data from CSV
    readTestCsvData() {
        this.http.get(this.csvTestUrl)
            .subscribe(
            data => this.extractTestData(data),
            err => this.handleError(err)
            );
    }

    //function to extract test data from CSV
    private extractTestData(res: Response) {

        TESTS.splice(0, TESTS.length);

        let csvTestData = res['_body'] || '';
        let allTextLines = csvTestData.split(/\r\n|\n/);
        let headers = allTextLines[0].split(',');
        let lines: any[] = [];

        for (let i = 0; i < allTextLines.length; i++) {
            // split content based on comma
            let data = allTextLines[i].split(',');
            if (data.length == headers.length) {
                let tarr: any[] = [];
                for (let j = 0; j < headers.length; j++) {
                    tarr.push(data[j]);
                }
                if (i > 0) { //ignore header row
                    let test = new Test(data[0], data[1], data[2], data[3], data[4], data[5], data[6], data[7]);
                    TESTS.push(test);
                    lines.push(tarr);
                }
            }
        }
        this.csvTestData = lines;
    }

    //Error handler
    private handleError(error: any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return errMsg;
    }
}