﻿(function ($, document, window) {

    function reload(page, providerId) {

        page.querySelector('.txtDevicePath').value = '';

        if (providerId) {
            ApiClient.getNamedConfiguration("livetv").done(function (config) {

                var info = config.TunerHosts.filter(function (i) {
                    return i.Id == providerId;
                })[0];

                page.querySelector('.txtDevicePath').value = info.Url || '';
            });
        }
    }

    function submitForm(page) {

        Dashboard.showLoadingMsg();

        var info = {
            Type: 'm3u',
            Url: page.querySelector('.txtDevicePath').value
        };

        var id = getParameterByName('id');

        if (id) {
            info.Id = id;
        }

        ApiClient.ajax({
            type: "POST",
            url: ApiClient.getUrl('LiveTv/TunerHosts'),
            data: JSON.stringify(info),
            contentType: "application/json"

        }).done(function (result) {

            Dashboard.processServerConfigurationUpdateResult();
            Dashboard.navigate('livetvstatus.html');

        }).fail(function () {
            Dashboard.hideLoadingMsg();
            Dashboard.alert({
                message: Globalize.translate('ErrorSavingTvProvider')
            });
        });

    }

    $(document).on('pageinit', "#liveTvTunerProviderM3UPage", function () {

        var page = this;

        $('form', page).on('submit', function () {
            submitForm(page);
            return false;
        });

    }).on('pageshow', "#liveTvTunerProviderM3UPage", function () {

        var providerId = getParameterByName('id');
        var page = this;
        reload(page, providerId);
    });

})(jQuery, document, window);
