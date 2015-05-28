### Possible IE11 problems

You may find that you need to specifically configure your (Local Intranet) IE11 installation to allow Thymol to use ajax for local file system loads. To do this, apply the "disable XSS filter" option:

    Tools>Internet Options>Security>Local intranet>Custom level...>Enable XSS filter>Disable
