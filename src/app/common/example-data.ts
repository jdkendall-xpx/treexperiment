/** Example table/database data. */
export const tables = {
  source: [
    {
      name: 'TimekeepingProject',
      type: 'database',
      children: [
        {
          name: 'employees',
          type: 'table',
          children: [
            {
              name: 'FIRST_NAME',
              type: 'column'
            },
            {
              name: 'LAST_NAME',
              type: 'column'
            },
            {
              name: 'PHONE_NUM',
              type: 'column'
            },
          ]
        },
        {
          name: 'timesheets',
          type: 'table',
          children: [
            {
              name: 'ENTRY_DATE',
              type: 'column',
            },
            {
              name: 'HOURS_WORKED',
              type: 'column',
            },
          ]
        }
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
