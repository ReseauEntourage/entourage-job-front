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
        action={`${process.env.SALESFORCE_LOGIN_URL}/servlet/servlet.WebToLead?encoding=UTF-8`}
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
          value="https://entourage-job-front-preprod.herokuapp.com/merci/company"
        />
        <input
          type="hidden"
          id="Status"
          name="Status"
          value="01J7Q000006SNNh"
        />
        <input
          type="hidden"
          id="00N7Q000001CyY3"
          name="00N7Q000001CyY3"
          value="Lead entrant - plateforme"
        />
        <input
          type="hidden"
          id="00N7Q000001CW7L"
          name="00N7Q000001CW7L"
          value="LinkedOut"
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
        <label htmlFor="email">
          Adresse e-mail
          <input id="email" maxLength="80" name="email" size="20" type="text" />
        </label>
        <br />
        <label htmlFor="mobile">
          Téléphone mobile
          <input
            id="mobile"
            maxLength="40"
            name="mobile"
            size="20"
            type="text"
          />
        </label>
        <br />
        Antenne :
        <select
          id="00N7Q000001D1ic"
          multiple="multiple"
          name="00N7Q000001D1ic"
          title="Antenne"
        >
          <option value="National">National</option>
          <option value="Paris">Paris</option>
          <option value="Lille">Lille</option>
          <option value="Lyon">Lyon</option>
          <option value="Rennes">Rennes</option>
          <option value="Seine Saint Denis">Seine Saint Denis</option>
          <option value="Hauts de Seine">Hauts de Seine</option>
          <option value="Hors zone">Hors zone</option>
          <option value="IDF">IDF</option>
          <option value="Autre région">Autre région</option>
        </select>
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
