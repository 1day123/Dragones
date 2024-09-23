<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>

    <body class="g-sidenav-pinned">
        @inertia
        <script>
          function dateToString(value)
          { 
            if(value == null){ 
              return null; 
            } else {

              const fecha = value;
              const anio = fecha.getFullYear();
              const mes = fecha.getMonth() + 1;
              const dia = fecha.getDate();
              const fechaValue = `${anio}-${mes}-${dia}`;

              return fechaValue;
            }
          }

          function stringToDate(value)
          { 
            if(value == null){ 
              return null; 
            } else {
              const [year, month, day] = value.split('-');  

              const date = new Date(+year, +month -1, +day);

              return date;
            }
          }
        </script>
       
    </body>
</html>

