import React, { useEffect } from 'react';


const lngs = {
    en: { nativeName: 'English' },
    es: { nativeName: 'Spanish' }
};

function LanguageSwitcher(i18next) {
    console.log("44 SWITCHER  :",i18next);
    return (
        <div>
            {Object.keys(lngs).map((lng) => (
                <button key={lng} style={{ fontWeight: i18next.i18n.resolvedLanguage === lng ? 'bold' : 'normal' }} type="submit" onClick={() => i18next.i18n.changeLanguage(lng)}>
                    {lngs[lng].nativeName}
                </button>
            ))}
        </div>
    );
}

export default LanguageSwitcher;
