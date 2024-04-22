import { writable } from 'svelte/store';
import type { AppStoreInfo } from './scrapeAppstore';
import type { ImprovementSuggestions } from './analysis';

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
