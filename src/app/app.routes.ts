import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'repos',
        loadChildren: () => import('./features/repos/repos.module').then(m => m.ReposModule)
    },
    {
        path: 'commits/:repo/:owner',
        loadChildren: () => import('./features/commits/commits.module').then(m => m.CommitsModule)
    },
    {
        path: '**',
        redirectTo: 'repos'
    },
    {
        path: '',
        redirectTo: 'repos',
        pathMatch: 'full'
    }
];
