function ajaxCall(pageNumber) {
    if(typeof pageNumber === 'undefined') {
        pageNumber = 1;
    }
    var providers     = [];
    var providerCount = 0;
    $('#providerPatients_providers').siblings('div').find('li.active').each( function() {
        var val = $(this).find('input').val();
        providers.push(val);
        providerCount++;
    });

    if (providerCount == 0) {
        $('#providerPatients_providers').siblings('div').find('li').each( function() {
            var val = $(this).find('input').val();
            providers.push(val);
        });
    }

    if (providers.length == 0) {
        $('#providerPatients_providers option').each( function() {
            if($(this).attr('selected') == 'selected') {
                providers.push($(this).val());
            }
        });
    }

    var statuses     = [];
    var statusCount  = 0;
    $('#providerPatients_status').siblings('div').find('li.active').each( function() {
        var val = $(this).find('input').val();
        statuses.push(val);
        statusCount++;
    });

    if( statusCount == 0 ) {
        $('#providerPatients_status').siblings('div').find('li').each( function() {
            var val = $(this).find('input').val();
            statuses.push(val);
        });
    }

    var searchText  = $('#search').val();
    var data = {
        providers: providers.join(','),
        statuses: statuses.join(','),
        searchText: searchText,
        pageNumber: pageNumber
    };
    $('#patients_loading').show();
    $.ajax({
        url: ajaxPatientListUrl,
        data: data,
        type: 'POST'
    }).done(function(response){
        var obj      = $.parseJSON(response);
        var source   = $("#patients-template").html();
        var template = Handlebars.compile(source);
        var html     = template(obj);
        $('#provider-patients-table').find('tbody').html(html);
        $('#pagination_links').html(obj.pagination);
        var totalCount = obj.totalCount;
        var countStart = ((pageNumber - 1)*10)+1;
        if(obj.itemCount == 10) {
            var countEnd   = pageNumber*10;
        } else if(obj.itemCount < 10) {
            var finalCount = 10 - (obj.itemCount);
            var countEnd   = (pageNumber*10) - finalCount;
        }

        if(totalCount > 0) {
            $('#paginationCount').removeClass('hide');
        } else {
            $('#paginationCount').addClass('hide');
        }

        $('#paginationCount').find('#count_start').text(countStart);
        $('#paginationCount').find('#count_end').text(countEnd);
        $('#paginationCount').find('#count_total').text(totalCount);
        $('#patients_loading').hide();
        $('.pagination').find('a').each(function() {
            var pageLink = $(this).attr('href');
            $(this).attr('data-page', pageLink.substr(pageLink.indexOf('page=') + 5));
            $(this).removeAttr('href');
        });
        $('.pagination').find('a').each(function() {
            $(this).on('click', function() {
                var pageNumber = $(this).attr('data-page');
                ajaxCall(pageNumber);
                return false;
            });
        });

        $('#provider-patients-table > tbody > tr').each(function() {
            if($(this).attr('data-filter')) {
                var filters = $(this).attr('data-filter').split('/');
                var provId  = "";
                if(filters.length > 0) {
                    provId = filters[0];
                }

                $(this).find('select.providerListSelect').val(provId);
                $(document).find('.providerListSelect').selectric();
            }
        })
    });
}
function filterPatients() {
    var providers     = [];
    var providerCount = 0;
    $('#providerPatients_providers').siblings('div').find('li.active').each( function() {
        var val = $(this).find('input').val();
        providers.push(val);
        providerCount++;
    });

    if (providerCount == 0) {
        $('#providerPatients_providers').siblings('div').find('li').each( function() {
            var val = $(this).find('input').val();
            providers.push(val);
        });
    }

    if (providers.length == 0) {
        $('#providerPatients_providers option').each( function() {
            if($(this).attr('selected') == 'selected') {
                providers.push($(this).val());
            }
        });
    }

    var statuses     = [];
    var statusCount  = 0;
    $('#providerPatients_status').siblings('div').find('li.active').each( function() {
        var val = $(this).find('input').val();
        statuses.push(val);
        statusCount++;
    });

    if( statusCount == 0 ) {
        $('#providerPatients_status').siblings('div').find('li').each( function() {
            var val = $(this).find('input').val();
            statuses.push(val);
        });
    }

    var searchText  = $('#search').val();
    $('#providerPatientFilter').submit();
}

$(function() {
    $('#add_patient_btn').on('click', function() {
        window.location = getPatientFormUrl;
    });

    if(validity == false) {
        $('#programEndDate').modal('show');
    }

    $(document).find('.pagination').find('a').each(function() {
        var pageLink = $(this).attr('href');
        $(this).attr('data-page', pageLink.substr(pageLink.indexOf('page=') + 5));
        $(this).removeAttr('href');
    });

    $(document).find('.pagination').find('a').each(function() {
        $(this).on('click', function() {
            var pageNumber    = $(this).attr('data-page');
            ajaxCall(pageNumber);
            return false;
        });
    });

    $(document).find('#addPatient_email_second').focus(function(e) {
        e.preventDefault();
        $('#addPatient_email_second').parent().parent().removeClass('error');
        $('#addPatient_email_second').siblings('span').remove();
    });

    // clear error message on focus
    $(document).find('#patientProgramEndDate_programEndDate').focus(function(e) {
        e.preventDefault();
        $("#patientProgramEndDate_programEndDate").datepicker({
            uiLibrary: 'bootstrap4'
        });
        $('#programEndDate').removeClass('error');
        $('#patientProgramEndDate_programEndDate').siblings('span').remove();
    });

    $(document).on('hidden.bs.modal', '#programEndDate', function(e){
        program_id = $("input[id=patientProgramEndDate_programId]").val();
        program_select_str = '#program_status_'+program_id;
        program_select_str_cuurent_val = $(program_select_str).data('current');
        $(program_select_str).val(program_select_str_cuurent_val);
        return false;
    });

    $(document).on('hidden.bs.modal', '#addWorkout', function(e){
        program_id = $(this).data('program');
        program_select_str = '#program_status_'+program_id;
        program_select_str_cuurent_val = $(program_select_str).data('current');
        $(program_select_str).val(program_select_str_cuurent_val);
        return false;
    });

    $(document).on('click', '#endDateBtn', function(e){
        endDateSubBtnClicked = true;
        //Logic to update program end date in Database
        var timestamp = $.now();
        var postVars = {
            'patient':$(this).data('patient'),
            'program':$(this).data('program'),
            'timestamp':timestamp
        };
        $.ajax({
            url: updateProgramStatusUrl,
            type: 'GET',
            data: postVars
        }).done(function(response) {
            var obj = $.parseJSON(response);
        });
        $('#programEndDate').modal('toggle');
    });

    $(document).find('.tooltip').tooltip();

    $(document).on('change', '.program-status', function(event){
        event.preventDefault();
        if($(this).val() == 0){
            var programId = $(this).find(':selected').data('program');
            var patientId = $(this).find(':selected').data('patient');
            //var formData = {programId: programId, patientId: patientId};
            window.location = getPatientFormUrl+'/'+programId+'/'+patientId;
        }
        else if($(this).val() == 3){
            endDateModalOrigin = $(this);
            $("input[id=patientProgramEndDate_programId]").val($(this).find(':selected').data('program'));
            $("#patientProgramEndDate_programEndDate").val(programEndDateVal);
            $('#programEndDate').modal('show');
            $("#patientProgramEndDate_programEndDate").datepicker({
                beforeShow: function() {
                    $(".ui-datepicker").css("font-size", 13);
                },
                minDate: new Date( $(this).data('start') ),
                maxDate: new Date()
            });
        }
        else{
            //Logic to update program status in Database
            var timestamp = $.now();
            tempStatus = $(this).val();
            $(this).data('current',tempStatus);
            var postVars = {
                'status':$(this).val(),
                'patient':$(this).find(':selected').data('patient'),
                'program':$(this).find(':selected').data('program'),
                'timestamp':timestamp
            };
            $.ajax({
                url: updateProgramStatusUrl,
                type: 'GET',
                data: postVars,
                dataType: 'html'
            }).done(function(response) {
                var obj = $.parseJSON(response)
                //console.log(obj);
                program_select_str = '#program_status_'+obj.programId;
                if($(program_select_str).val() == 1){
                    $(program_select_str).find('option').each(function(index,element){
                        //console.log(element);
                        if(element.text == 'Activate'){
                            element.text = 'Active';
                        }
                        if(element.text == 'Suspended'){
                            element.text = 'Suspend';
                        }
                    });
                }
                if($(program_select_str).val() == 2){
                    $(program_select_str).find('option').each(function(index,element){
                        //console.log(element);
                        if(element.text == 'Active'){
                            element.text = 'Activate';
                        }
                        if(element.text == 'Suspend'){
                            element.text = 'Suspended';
                        }
                    });
                }
            });

        }//End of Else
    });

    $('#providerPatients_providers option').each( function() {
        if($(this).val() == currentUser) {
            $(this).attr('selected', 'selected');
        } else {
            $(this).removeAttr('selected');
        }
    });

    $('#providerPatients_providers').multiselect({
        nonSelectedText: 'Providers: All',
        selectAllNumber: false,
        maxHeight: 400,
        buttonContainer: '<div class="btn-group providerListDD" />',
        buttonWidth: 'auto',
        templates: { li: '<li><a class="dropdown-item" tabindex="0"><label style="padding-left: 10px;width: 100%"></label></a></li>' },
        buttonText: function(options, select) {
            if (options.length === 0) {
                return 'Providers: All';
            }
            else {
                var labels = [];
                options.each(function() {
                    if ($(this).attr('label') !== undefined) {
                        labels.push($(this).attr('label'));
                    }
                    else {
                        labels.push($(this).html());
                    }
                });
                return labels.join(', ') + '';
            }
        },
        onSelectAll: function() {
            ajaxCall();
        },
        onDeselectAll: function() {
            ajaxCall();
        },
        onChange : function(option, checked) {
            ajaxCall();
        }
    });

    $('#providerPatients_status').multiselect({
        nonSelectedText: 'Status: All',
        selectAllNumber: false,
        buttonText: function(options, select) {
            if (options.length === 0) {
                return 'Status: All';
            }
            else {
                var labels = [];
                options.each(function() {
                    if ($(this).attr('label') !== undefined) {
                        labels.push($(this).attr('label'));
                    }
                    else {
                        labels.push($(this).html());
                    }
                });
                return labels.join(', ') + '';
            }
        },
        onSelectAll: function() {
            ajaxCall();
        },
        onDeselectAll: function() {
            ajaxCall();
        },
        onChange : function(option, checked) {
            ajaxCall();
        }
    });

    $('#search').on('keyup', function() {
        ajaxCall();
    });

    $('#clear-search').on('click', function() {
        $('#search').val('');
        ajaxCall();
    });

    $(document).on('click', '.showProgress', function() {
        var param = $(this).attr('data-param');
        window.location = showProgressUrl.replace('idParam', param);
    });

    $(document).on('click', '.listWorkout', function() {
        var param = $(this).attr('data-param');
        window.location = listWorkoutUrl.replace('idParam', param);
    });

    $(document).on('click', '.message_link', function() {
        var param = $(this).attr('data-param');
        window.location = messageLinkUrl.replace('idParam', param);
    });
    $(document).on('click', '.view_link', function() {
        var param = $(this).attr('data-param');
        window.location = patientProfileLink.replace('idParam', param);
    });

    $(document).on('change', '.providerListSelect', function() {
        var providerId = $(this).val();
        var patientId  = $(this).attr('data-patient');

        var data = {'providerId': providerId, 'patients': patientId};
        $('#patients_loading').show();

        $.ajax({
            url: assignPatientsUrl,
            method: 'POST',
            data: data
        }).done(function(response) {
            var responseObj = $.parseJSON(response);
            if(responseObj.status == 1) {
                $('#assignMessage').addClass('alert-success');
            } else {
                $('#assignMessage').addClass('alert-danger');
            }
            $('#assignMessage').html(responseObj.message);
            $('#assignMessage').removeClass('hide');
            $('#patients_loading').hide();

            ajaxCall();

            setInterval(function() {
                $('#assignMessage').addClass('hide');
            }, 10000)
        });
    });
    $(document).find('.providerListSelect').selectric();
});