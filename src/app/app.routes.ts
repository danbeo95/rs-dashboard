import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('@angular-nx-workspace/feature-dashboard').then(
        (m) => m.FeatureDashboard
      ),
    children: [
      {
        path: 'ports',
        loadComponent: () =>
          import('@angular-nx-workspace/feature-port').then(
            (m) => m.FeaturePort
          ),
      },
      {
        path: 'ports/:id',
        loadComponent: () =>
          import('@angular-nx-workspace/feature-port-detail').then(
            (m) => m.FeaturePortDetail
          ),
      },
      {
        path: 'customers',
        loadComponent: () =>
          import('@angular-nx-workspace/feature-customer').then(
            (m) => m.FeatureCustomer
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('@angular-nx-workspace/feature-setting').then(
            (m) => m.FeatureSetting
          ),
      },
      {
        path: 'home',
        loadComponent: () =>
          import('@angular-nx-workspace/feature-home').then(
            (m) => m.FeatureHome
          ),
      },
      {
        path: '',
        redirectTo: 'ports',
        pathMatch: 'full'
      }
    ]
  },
];
