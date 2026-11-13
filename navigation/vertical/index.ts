import type { VerticalNavItems } from '@layouts/types'

export const mainNavItems = [
  {
    title: 'Dashboard',
    to: { name: 'index' },
    icon: { icon: 'ri-home-smile-line' },
  },
  {
    title: 'Foundation',
    icon: { icon: 'ri-palette-line' },
    children: [
      { title: 'Typography', to: { name: 'design-system-typography' }, icon: { icon: 'ri-circle-line' } },
      { title: 'Color System', to: { name: 'design-system-color-system' }, icon: { icon: 'ri-circle-line' } },
      { title: 'Spacing', to: { name: 'design-system-spacing' }, icon: { icon: 'ri-circle-line' } },
      { title: 'Iconography', to: { name: 'design-system-iconography' }, icon: { icon: 'ri-circle-line' } },
    ],
  },
  {
    title: 'Component',
    icon: { icon: 'ri-layout-grid-line' },
    children: [
      { title: 'Buttons', to: { name: 'components-buttons' }, icon: { icon: 'ri-circle-line' } },
      { title: 'Text Field', to: { name: 'components-text-field' }, icon: { icon: 'ri-circle-line' } },
      { title: 'Tabs', to: { name: 'components-tabs' }, icon: { icon: 'ri-circle-line' } },
      { title: 'Stepper', to: { name: 'components-stepper' }, icon: { icon: 'ri-circle-line' } },
      { title: 'Breadcrumb', to: { name: 'components-breadcrumb' }, icon: { icon: 'ri-circle-line' } },
      { title: 'Select', to: { name: 'components-select' }, icon: { icon: 'ri-circle-line' } },
      { title: 'Autocomplete', to: { name: 'components-autocomplete' }, icon: { icon: 'ri-circle-line' } },
      { title: 'Checkbox', to: { name: 'components-checkbox' }, icon: { icon: 'ri-circle-line' } },
      { title: 'Radio', to: { name: 'components-radio' }, icon: { icon: 'ri-circle-line' } },
      { title: 'Switch', to: { name: 'components-switch' }, icon: { icon: 'ri-circle-line' } },
      { title: 'Card', to: { name: 'components-card' }, icon: { icon: 'ri-circle-line' } },
      { title: 'Dialog', to: { name: 'components-dialog' }, icon: { icon: 'ri-circle-line' } },
      { title: 'Table', to: { name: 'components-table' }, icon: { icon: 'ri-circle-line' } },
      { title: 'Pagination', to: { name: 'components-pagination' }, icon: { icon: 'ri-circle-line' } },
    ],
  },
] satisfies VerticalNavItems

export const bottomNavItems: VerticalNavItems = []

export default mainNavItems
