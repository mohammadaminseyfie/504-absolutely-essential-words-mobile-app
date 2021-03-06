import {Component, OnInit} from '@angular/core';
import {Http} from '@angular/http';
import {NavController, Platform} from 'ionic-angular';

import {LessonPage} from '../lesson/lesson';
import {CommonProvider} from '../../providers/common/common';
import {SettingsProvider} from '../../providers/settings/settings';
import {LessonsProvider} from '../../providers/lessons/lessons';
import {FeedBackProvider} from '../../providers/feed-back/feed-back';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
    providers: [Http]
})
export class HomePage implements OnInit {
    private items = [];
    private loading = true;

    private splash = true;
    private tabBarElement: any;

    constructor(public navCtrl: NavController,
                public platform: Platform,
                public commonProvider: CommonProvider,
                public lessonsProvider: LessonsProvider,
                public feedBackProvider: FeedBackProvider,
                public settingsProvider: SettingsProvider) {
        this.tabBarElement = document.querySelector('.tabbar');
    }

    ngOnInit() {
        this.platform.ready().then((readySource) => {
            this.settingsProvider.setDefaultSettings(); // mapping default settings

            // caching all lessons to the local database
            this.commonProvider.cacheLessons(() => {
                // once caching is done hide loading spinner and render the list...
                this.lessonsProvider.getAllLessons().then(data => {
                    this.items = data.items;
                    this.loading = false;
                });
            });

            // caching all words to the local database
            this.commonProvider.cacheWords();

            // sending feedBack if there is any
            // this.feedBackProvider.sendFeedBackFromLocalStorageToServer();
        });
    }

    viewLesson(lessonId, lessonTitle) {
        this.navCtrl.push(LessonPage, {lessonId: lessonId, lessonTitle: lessonTitle});
    }

    ionViewDidLoad() {
        this.tabBarElement.style.display = 'none';
        setTimeout(() => {
            this.splash = false;
            this.tabBarElement.style.display = 'flex';
        }, 4000);
    }
}
