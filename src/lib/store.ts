import { writable } from 'svelte/store';
import type { AppStoreInfo } from './scrapeAppstore';

interface Project {
	url: string | undefined;
	appStoreInfo: AppStoreInfo | undefined;
}
const defaultProject: Project = {
	url: undefined
};

let current: Project;

const stored = localStorage.getItem('project');
// console.log('stored', stored);
if (stored !== null) {
	current = JSON.parse(stored);
} else {
	current = defaultProject;
}

export const project = writable<Project>(current);
project.subscribe((value) => (localStorage.project = JSON.stringify(value)));
