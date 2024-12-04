export const checkDevicesPC = () => {
    const userAgent = window.navigator.userAgent;
    const platform = window.navigator.platform;

    const isDesktopUserAgent = !/Mobi|Android/i.test(userAgent);
    const isDesktopPlatform = /Win|Mac|Linux/.test(platform);
    const isDesktopScreen = window.matchMedia('(min-width: 1024px)').matches;

    return isDesktopUserAgent && isDesktopPlatform && isDesktopScreen;
};
