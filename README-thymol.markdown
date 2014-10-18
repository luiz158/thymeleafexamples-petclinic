### Possible IE11 problems

You may find that you need to apply "disable XSS filter" to your Local Intranet IE11 configuraton to allow Thymol to use ajax for local file system loads.

By doing something like this:

    Tools>Internet Options>Security>Local intranet>Custom level...>Enable XSS filter>Disable
