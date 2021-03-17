/** Example table/database data. */
export const tables = {
  source: [
    {
      name: 'TimekeepingProject',
      type: 'database',
      children: [
        {name: 'employees', type: 'table'},
        {name: 'timesheets', type: 'table'}
      ]
    },
    {
      name: 'WeatherProject',
      type: 'database',
      children: [
        {name: 'forecasts', type: 'table'},
        {name: 'stations', type: 'table'}
      ]
    }
  ],
  destination: [
    {
      name: 'TimekeepingProject',
      type: 'database',
      children: [
        {name: 'employees', type: 'table'}
      ]
    }
  ]
};
