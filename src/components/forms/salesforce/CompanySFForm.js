import React from 'react';
import Script from 'next/script';

export const CompanySFForm = () => {
  return (
    <>
      <Script src="https://www.google.com/recaptcha/api.js" />
      <Script id="captcha-script">
        {`
              function timestamp() {
                var response = document.getElementById("g-recaptcha-response");
                if (response == null || response.value.trim() == "") {
                  var elems = JSON.parse(document.getElementsByName("captcha_settings")[0].value);
                  elems["ts"] = JSON.stringify(new Date().getTime());
                  document.getElementsByName("captcha_settings")[0].value = JSON.stringify(elems);
                }
              }
              setInterval(timestamp, 500);
            `}
      </Script>
      <form
        action="https://entourage2--dev2loko.sandbox.my.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8"
        method="POST"
      >
        <input
          type="hidden"
          name="captcha_settings"
          value='{"keyname":"ReCaptcha","fallback":"true","orgId":"00D0D0000008hdK","ts":""}'
        />
        <input type="hidden" name="oid" value="00D0D0000008hdK" />
        <input
          type="hidden"
          name="retURL"
          value="https://linkedout.fr/merci/company"
        />
        <label htmlFor="first_name">
          Prénom
          <input
            id="first_name"
            maxLength="40"
            name="first_name"
            size="20"
            type="text"
          />
        </label>
        <br />

        <label htmlFor="last_name">
          Nom
          <input
            id="last_name"
            maxLength="80"
            name="last_name"
            size="20"
            type="text"
          />
        </label>
        <br />

        <label htmlFor="email">
          Adresse e-mail
          <input id="email" maxLength="80" name="email" size="20" type="text" />
        </label>
        <br />

        <label htmlFor="company">
          Société
          <input
            id="company"
            maxLength="40"
            name="company"
            size="20"
            type="text"
          />
        </label>
        <br />

        <label htmlFor="city">
          Ville
          <input id="city" maxLength="40" name="city" size="20" type="text" />
        </label>
        <br />

        <label htmlFor="state">
          Région/Province
          <input id="state" maxLength="20" name="state" size="20" type="text" />
        </label>
        <br />

        <div
          className="g-recaptcha"
          data-sitekey="6LdDBrsiAAAAADurh4djKM_jVcYIWuacfP9gwI-G"
        />
        <br />
        <input type="submit" name="submit" />
      </form>
    </>
  );
};
