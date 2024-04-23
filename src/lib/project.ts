import { writable } from 'svelte/store';
import { emptyProject, type Project } from '$lib/types.d';

let current: Project;

const stored = localStorage.getItem('project');
if (stored !== null) {
	current = JSON.parse(stored);
} else {
	current = emptyProject;
}

export const project = writable<Project>(current);
project.subscribe((value) => (localStorage.project = JSON.stringify(value)));
