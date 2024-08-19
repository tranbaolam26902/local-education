export const getDefaultPageTitle = () => {
    return import.meta.env.VITE_DEFAULT_TITLE;
};

export const getSubPageTitle = (title) => {
    return title ? title + ' | ' + import.meta.env.VITE_DEFAULT_TITLE : getDefaultPageTitle();
};
