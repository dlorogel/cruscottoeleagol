sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/Filter',
    "sap/m/Dialog",
    "sap/m/DialogType",
    "sap/m/Button",
    "sap/m/ButtonType",
    "sap/m/Text",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "../model/formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, Dialog, DialogType, Button, ButtonType, Text, FilterOperator, MessageToast, Fragment, formatter) {
        "use strict";

        const oAppController = Controller.extend("it.orogel.zcruscottoeleagol.controller.View1", {
            formatter: formatter,
            onInit: function () {
                this.oComponent = this.getOwnerComponent();
                this.oGlobalBusyDialog = new sap.m.BusyDialog();
            },
            onRicerca: function () {
                this.oComponent.busy(true);
                this.SocietaInput = this.getView().byId("idSocieta").getValue();
                const oFinalFilter = new Filter({
                    filters: [],
                    and: true
                });
                let aStatusFilter = [];
                aStatusFilter.push(new Filter("Status", FilterOperator.EQ, ""));
                oFinalFilter.aFilters.push(new Filter({
                    filters: aStatusFilter,
                    and: false
                }));
                if (this.SocietaInput !== undefined && this.SocietaInput !== "") {
                    let aSocietaFilter = [];
                    aSocietaFilter.push(new Filter("Bukrs", FilterOperator.EQ, this.SocietaInput));
                    oFinalFilter.aFilters.push(new Filter({
                        filters: aSocietaFilter,
                        and: false
                    }));
                };
                if (this.DataDaInput !== undefined && this.DataDaInput !== "" && !(isNaN(this.DataDaInput))) {
                    let aDataDaInputFilter = [];
                    aDataDaInputFilter.push(new Filter("Bldat", FilterOperator.GE, this.DataDaInput));
                    oFinalFilter.aFilters.push(new Filter({
                        filters: aDataDaInputFilter,
                        and: false
                    }));
                };
                if (this.DataAInput !== undefined && this.DataAInput !== "" && !(isNaN(this.DataAInput))) {
                    let aDataAInputFilter = [];
                    aDataAInputFilter.push(new Filter("Bldat", FilterOperator.LE, this.DataAInput));
                    oFinalFilter.aFilters.push(new Filter({
                        filters: aDataAInputFilter,
                        and: false
                    }));
                };
                const oPromiseDocumento = new Promise((resolve, reject) => {
                    this.getView().getModel("MainModel").read("/HEADERPOSSet", {
                        filters: [oFinalFilter],
                        success: (aData) => {
                            resolve(aData.results);
                        },
                        error: (oError) => {
                            reject;
                        }
                    });
                });
                oPromiseDocumento.then((aResult) => {
                    this.oComponent.resetAllBusy();
                    aResult.forEach(x => {
                        x.Selected = false;
                        x.Editable = false;
                        x.enableNote = false;
                    })
                    /*aResult.push({
                        "Num": "100",
                        "Numpos": "1",
                        "Bukrs": "IT02",
                        "Blart": "AB",
                        "Bldat": "10.10.2022",
                        "Budat": "10.10.2022",
                        "Bktxt": "Test Elea Gol",
                        "Xblnr": "TestBapi",
                        "Waers": "EUR",
                        "Mwskz": "",
                        "Bschl": "D",
                        "Newko": "80210001",
                        "Wrbtr": "100.00",
                        "Zuonr": "",
                        "Sgtxt": "Testo Posizione 1",
                        "Kostl": "IT02A12007",
                        "Prctr": "",
                        "MlmatPspnr": ""
                    });
                    aResult.push({
                        "Num": "100",
                        "Numpos": "2",
                        "Bukrs": "IT02",
                        "Blart": "AB",
                        "Bldat": "10.10.2022",
                        "Budat": "10.10.2022",
                        "Bktxt": "Test Elea Gol",
                        "Xblnr": "TestBapi",
                        "Waers": "EUR",
                        "Mwskz": "",
                        "Bschl": "A",
                        "Newko": "4110001",
                        "Wrbtr": "100.00",
                        "Zuonr": "",
                        "Sgtxt": "Testo Posizione 2",
                        "Kostl": "",
                        "Prctr": "",
                        "MlmatPspnr": "",
                        "Editable": false
                    });
                    aResult.push({
                        "Num": "100",
                        "Numpos": "3",
                        "Bukrs": "test",
                        "Blart": "",
                        "Bldat": "01.01.2023",
                        "Budat": "01.01.2023",
                        "Bktxt": "",
                        "Xblnr": "",
                        "Waers": "EUR",
                        "Mwskz": "AA",
                        "Bschl": "",
                        "Newko": "",
                        "Wrbtr": 3.00,
                        "Zuonr": "",
                        "Sgtxt": "",
                        "Kostl": "",
                        "Prctr": "",
                        "MlmatPspnr": ""
                    });
                    aResult.push({
                        "Num": "200",
                        "Numpos": "1",
                        "Bukrs": "test",
                        "Blart": "",
                        "Bldat": "01.01.2023",
                        "Budat": "01.01.2023",
                        "Bktxt": "",
                        "Xblnr": "",
                        "Waers": "EUR",
                        "Mwskz": "AA",
                        "Bschl": "",
                        "Newko": "",
                        "Wrbtr": 1.00,
                        "Zuonr": "",
                        "Sgtxt": "",
                        "Kostl": "",
                        "Prctr": "",
                        "MlmatPspnr": ""
                    });*/
                    this._setTableModel(aResult);
                }, oError => {
                    MessageToast.show(this.oComponent.i18n().getText("msg.error.zcruscottoeleagol.text"));
                    this.oComponent.resetAllBusy();
                });
            },
            onSelezionaTutte: function () {
                const oAppModel = this.getView().getModel("appModel");
                var AllRows = oAppModel.getProperty("/rows");
                AllRows.forEach(x => {
                    x.Selected = true;
                });
                oAppModel.refresh(true);
            },
            onDeselezionaTutte: function () {
                const oAppModel = this.getView().getModel("appModel");
                var AllRows = oAppModel.getProperty("/rows");
                AllRows.forEach(x => {
                    x.Selected = false;
                });
                oAppModel.refresh(true);
            },
            onSeleziona: function () {
                const oAppModel = this.getView().getModel("appModel");
                var AllRows = oAppModel.getProperty("/rows");
                var AllRowsLength = AllRows.length;
                for (var i = 0; i < AllRowsLength; i++) {
                    var oSelected = AllRows[i];
                    if (oSelected.Selected === true) {
                        for (var j = 0; j < AllRowsLength; j++) {
                            var oToBeSelect = AllRows[j];
                            if (oToBeSelect.Num === oSelected.Num && oToBeSelect.Bukrs === oSelected.Bukrs && oToBeSelect.Blart === oSelected.Blart) {
                                oToBeSelect.Selected = true;
                            }
                        }
                    }
                }
                oAppModel.refresh(true);
            },
            onSalvare: function () {
                //this.oGlobalBusyDialog.open();
                this.oComponent.busy(true);
                const oAppModel = this.getView().getModel("appModel");
                const oMainModel = this.getView().getModel("MainModel");
                var Rows = oAppModel.getProperty("/rows");
                var RowsCBO = oAppModel.getProperty("/rowsCBO");
                var Modificati = [];
                var Selected = Rows.filter(x => x.Editable === true && !x.Send);
                Selected.forEach(x => {
                    var Find = RowsCBO.find(y => x.Num === y.Num && x.Numpos === y.Numpos && x.Bukrs === y.Bukrs && x.Budat.toISOString() === y.Budat);
                    if (Find) {
                        delete Find.Editable;
                        delete Find.Selected;
                        if (x.Bktxt !== Find.Bktxt) {
                            Modificati.push(JSON.parse(JSON.stringify(x)));
                        } else if (x.Sgtxt !== Find.Sgtxt) {
                            Modificati.push(JSON.parse(JSON.stringify(x)));
                        } else if (x.Xblnr !== Find.Xblnr) {
                            Modificati.push(JSON.parse(JSON.stringify(x)));
                        } else if (x.Newko !== Find.Newko) {
                            Modificati.push(JSON.parse(JSON.stringify(x)));
                        } else if (x.Zuonr !== Find.Zuonr) {
                            Modificati.push(JSON.parse(JSON.stringify(x)));
                        }
                    }
                });

                const oPromise = new Promise((resolve, reject) => {
                    this._callModifica(resolve, reject, Modificati);
                });
                Promise.all([oPromise]).then(() => {
                    MessageToast.show(this.oComponent.i18n().getText("msg.success.api.modifica"));
                    this.oComponent.resetAllBusy();
                    this.onRicerca();
                }, oError => {
                    MessageToast.show(this.oComponent.i18n().getText("msg.error.api.modifica"));
                    this.oComponent.resetAllBusy();
                });
                oAppModel.setProperty("/rowsCBO", JSON.parse(JSON.stringify(Rows)));
            },
            _callModifica: function (resolve, reject, Modificati) {
                var batchChanges = [];
                var sServiceUrl = "/sap/opu/odata/sap/ZCRUSCOTTOELEAGOL_SRV/";
                var oDataModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
                if (Modificati.length === 0) {
                    resolve();
                } else {
                    Modificati.forEach(x => {
                        delete x.Editable;
                        delete x.Selected;
                        delete x.enableNote;
                        delete x.__metadata;
                        x.Bldat = new Date(x.Bldat);
                        x.Budat = new Date(x.Budat);
                        x.Bldat.setHours(x.Bldat.getHours() - x.Bldat.getTimezoneOffset() / 60);
                        x.Budat.setHours(x.Budat.getHours() - x.Budat.getTimezoneOffset() / 60);
                        var DataTo = sap.ui.model.odata.ODataUtils.formatValue(new Date(x.Budat), "Edm.DateTime");
                        //x.Bldat = x.Bldat.toJSON().slice(0, 19);
                        //x.Budat = x.Budat.toJSON().slice(0, 19);
                        var ModifyString = "ZFI_PREV_ELEAGOLSet(Num='" + x.Num + "',Numpos='" + x.Numpos + "',Bukrs='" + x.Bukrs + "',Budat=" + DataTo + ")";
                        batchChanges.push(oDataModel.createBatchOperation(encodeURIComponent(ModifyString), "PATCH", x));
                    });
                    oDataModel.addBatchChangeOperations(batchChanges);
                    oDataModel.submitBatch(function (data, responseProcess) {
                        resolve();
                    }.bind(this),
                        function (err) {
                            reject();
                        });
                }
            },
            onModificare: function () {
                const oAppModel = this.getView().getModel("appModel");
                var AllRows = oAppModel.getProperty("/rows");
                var Selected = AllRows.filter(x => x.Selected === true && !x.Send);
                Selected.forEach(x => {
                    x.Editable = true;
                });
                oAppModel.refresh(true);
            },
            /*onDeclinare: function () {
                const oAppModel = this.getView().getModel("appModel");
                var AllRows = oAppModel.getProperty("/rows");
                var Selected = AllRows.filter(x => x.Selected === true);
                Selected.forEach(x => {
                    x.EsitoTest = "Declinato";
                });
                oAppModel.refresh(true);
            },*/
            onDeclinare: function () {
                const oAppModel = this.getView().getModel("appModel");
                var AllRows = oAppModel.getProperty("/rows");
                var AllRowsLength = AllRows.length;
                for (var i = 0; i < AllRowsLength; i++) {
                    var oSelected = AllRows[i];
                    if (oSelected.Selected === true) {
                        for (var j = 0; j < AllRowsLength; j++) {
                            var oToBeSelect = AllRows[j];
                            if (oToBeSelect.Num === oSelected.Num && oToBeSelect.Bukrs === oSelected.Bukrs && oToBeSelect.Blart === oSelected.Blart) {
                                oToBeSelect.EsitoTest = "Declinato";
                            }
                        }
                    }
                }
                oAppModel.refresh(true);
            },
            DataDaChange: function (oEvent) {
                this.DataDaInput = this.getView().byId("DataDaInput").getValue();
                var dateParts = this.DataDaInput.split(".");
                var date = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
                this.DataDaInput = new Date(date);
                let timezone = this.DataDaInput.getTimezoneOffset() / 60;
                this.DataDaInput.setHours(this.DataDaInput.getHours() - timezone);
            },
            DataAChange: function (oEvent) {
                this.DataAInput = this.getView().byId("DataAInput").getValue();
                var dateParts = this.DataAInput.split(".");
                var date = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
                this.DataAInput = new Date(date);
                let timezone = this.DataAInput.getTimezoneOffset() / 60;
                this.DataAInput.setHours(this.DataAInput.getHours() - timezone);
            },
            onSimulare: function () {
                //this.oGlobalBusyDialog.open();
                this.oComponent.busy(true);
                const oAppModel = this.getView().getModel("appModel");
                var AllRows = oAppModel.getProperty("/rows");
                var Selected = AllRows.filter(x => x.Selected === true && !x.Send);
                var aPayload = [];
                Selected.forEach(x => {
                    /*var dateParts = x.Bldat.split(".");
                    var date = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
                    date.setHours(date.getHours() - date.getTimezoneOffset() / 60);
                    var Bldat = date;
                    dateParts = x.Budat.split(".");
                    date = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
                    date.setHours(date.getHours() - date.getTimezoneOffset() / 60);
                    var Budat = date;*/
                    //x.Bldat.setHours(x.Bldat.getHours() + x.Bldat.getTimezoneOffset() / 60);
                    //x.Budat.setHours(x.Budat.getHours() + x.Budat.getTimezoneOffset() / 60);
                    if (aPayload.filter(y => y.Num === x.Num && y.Bukrs === x.Bukrs && y.Blart === x.Blart).length === 0) {
                        var Header = {
                            "Num": x.Num,
                            "Operazione": "S",
                            "Bukrs": x.Bukrs,
                            "Blart": x.Blart,
                            "Bldat": x.Bldat,
                            "Budat": x.Budat,
                            "Bktxt": x.Bktxt,
                            "Xblnr": x.Xblnr,
                            "Waers": x.Waers,
                            "HEADERTOPOS": []
                        };
                        var oItem = {
                            "Num": x.Num,
                            "Numpos": x.Numpos,
                            "Bschl": x.Bschl,
                            "Newko": x.Newko,
                            "Mwskz": x.Mwskz,
                            "Wrbtr": x.Wrbtr,
                            "Zuonr": x.Zuonr,
                            "Sgtxt": x.Sgtxt,
                            "Kostl": x.Kostl,
                            "Prctr": x.Prctr,
                            "MlmatPspnr": x.MlmatPspnr,
                            "TipoConto": x.TipoConto
                        };
                        Header.HEADERTOPOS.push(oItem);
                        aPayload.push(Header);
                    } else {
                        var oItem = {
                            "Num": x.Num,
                            "Numpos": x.Numpos,
                            "Bschl": x.Bschl,
                            "Newko": x.Newko,
                            "Mwskz": x.Mwskz,
                            "Wrbtr": x.Wrbtr,
                            "Zuonr": x.Zuonr,
                            "Sgtxt": x.Sgtxt,
                            "Kostl": x.Kostl,
                            "Prctr": x.Prctr,
                            "MlmatPspnr": x.MlmatPspnr,
                            "TipoConto": x.TipoConto
                        };
                        aPayload.find(y => y.Num === x.Num && y.Bukrs === x.Bukrs && y.Blart === x.Blart).HEADERTOPOS.push(oItem);
                    }
                });
                var aResultsSimulazione = [];
                let oPromiseSimulazione = Promise.resolve();
                aPayload.forEach(x => {
                    oPromiseSimulazione = oPromiseSimulazione.then(() => {
                        return this._callSimulazione(x, aResultsSimulazione);
                    })
                });
                oPromiseSimulazione.then(() => {
                    Selected.forEach(x => {
                        var Find = aResultsSimulazione.find(y => y.Num === x.Num && y.Bukrs === x.Bukrs && y.Blart === x.Blart);
                        if (Find) {
                            x.Note = Find.ReturnMessage;
                            if (x.Note !== "") {
                                x.enableNote = true;
                                x.EsitoTest = "Error";
                            } else {
                                x.enableNote = false;
                                x.EsitoTest = "Success";
                            }
                        }
                    });
                    this.onDeselezionaTutte();
                    this.oComponent.resetAllBusy();
                }, oError => {
                    MessageToast.show(this.oComponent.i18n().getText("msg.error.simulazione.text"));
                    this.oComponent.resetAllBusy();
                });
            },
            onRegistrare: function () {
                this.oComponent.busy(true);
                const oAppModel = this.getView().getModel("appModel");
                var AllRows = oAppModel.getProperty("/rows");
                var Selected = AllRows.filter(x => x.Selected === true && (x.EsitoTest === "" || x.EsitoTest === "Success") && !x.Send);
                var aPayload = [];
                Selected.forEach(x => {
                    //x.Bldat.setHours(x.Bldat.getHours() + x.Bldat.getTimezoneOffset() / 60);
                    //x.Budat.setHours(x.Budat.getHours() + x.Budat.getTimezoneOffset() / 60);
                    if (aPayload.filter(y => y.Num === x.Num && y.Bukrs === x.Bukrs && y.Blart === x.Blart).length === 0) {
                        var Header = {
                            "Num": x.Num,
                            "Operazione": "R",
                            "Bukrs": x.Bukrs,
                            "Blart": x.Blart,
                            "Bldat": x.Bldat,
                            "Budat": x.Budat,
                            "Bktxt": x.Bktxt,
                            "Xblnr": x.Xblnr,
                            "Waers": x.Waers,
                            "HEADERTOPOS": []
                        };
                        var oItem = {
                            "Num": x.Num,
                            "Numpos": x.Numpos,
                            "Bschl": x.Bschl,
                            "Newko": x.Newko,
                            "Wrbtr": x.Wrbtr,
                            "Zuonr": x.Zuonr,
                            "Sgtxt": x.Sgtxt,
                            "Kostl": x.Kostl,
                            "Prctr": x.Prctr,
                            "MlmatPspnr": x.MlmatPspnr,
                            "TipoConto": x.TipoConto
                        };
                        Header.HEADERTOPOS.push(oItem);
                        aPayload.push(Header);
                    } else {
                        var oItem = {
                            "Num": x.Num,
                            "Numpos": x.Numpos,
                            "Bschl": x.Bschl,
                            "Newko": x.Newko,
                            "Wrbtr": x.Wrbtr,
                            "Zuonr": x.Zuonr,
                            "Sgtxt": x.Sgtxt,
                            "Kostl": x.Kostl,
                            "Prctr": x.Prctr,
                            "MlmatPspnr": x.MlmatPspnr,
                            "TipoConto": x.TipoConto
                        };
                        aPayload.find(y => y.Num === x.Num && y.Bukrs === x.Bukrs && y.Blart === x.Blart).HEADERTOPOS.push(oItem);
                    }
                });
                var aResultsRegistrazione = [];
                let oPromiseRegistrazione = Promise.resolve();
                aPayload.forEach(x => {
                    oPromiseRegistrazione = oPromiseRegistrazione.then(() => {
                        return this._callRegistrazione(x, aResultsRegistrazione);
                    })
                });
                oPromiseRegistrazione.then(() => {
                    Selected.forEach(x => {
                        var Find = aResultsRegistrazione.find(y => y.Num === x.Num && y.Bukrs === x.Bukrs && y.Blart === x.Blart);
                        if (Find) {
                            x.Note = Find.ReturnMessage;
                            if (x.Note !== "") {
                                x.enableNote = true;
                                x.EsitoTest = "Error";
                            } else {
                                x.Note = Find.ReturnSuccessMessage;
                                x.enableNote = true;
                                x.Send = true;
                                x.EsitoTest = "Success";
                            }
                        }
                    });
                    this.onDeselezionaTutte();
                    this.oComponent.resetAllBusy();
                }, oError => {
                    MessageToast.show(this.oComponent.i18n().getText("msg.error.registrazione.text"));
                    this.oComponent.resetAllBusy();
                });
            },
            onNote: function (oEvent) {
                //this.oComponent.busy(true);
                var Document = oEvent.getSource().getBindingContext().getObject();
                this.oDefaultMessageDialog = new Dialog({
                    type: DialogType.Message,
                    title: "Note",
                    content: new Text({
                        text: Document.Note
                    }),
                    beginButton: new Button({
                        type: ButtonType.Emphasized,
                        text: "OK",
                        press: function () {
                            this.oDefaultMessageDialog.close();
                        }.bind(this)
                    })
                });
                this.oDefaultMessageDialog.open();
                //this.oComponent.resetAllBusy();
            },
            onNewkoVHRequest: function (oEvent) {
                var sInputValue = oEvent.getSource().getValue(),
                    oView = this.getView();
                this.IndiceValueHelp = oEvent.getSource().getParent().getIndex();
                var Selected = this.getView().byId("AccountingDocument").getContextByIndex(this.IndiceValueHelp).getObject();
                var aNewko = [];
                const oFinalFilter = new Filter({
                    filters: [],
                    and: false
                });
                let aBukrsFilter = [];
                aBukrsFilter.push(new Filter("Bukrs", FilterOperator.EQ, Selected.Bukrs));
                oFinalFilter.aFilters.push(new Filter({
                    filters: aBukrsFilter,
                    and: true
                }));
                const oPromiseNewko = new Promise((resolve, reject) => {
                    this.getView().getModel("MainModel").read("/Skb1Set", {
                        filters: [oFinalFilter],
                        success: (aData) => {
                            resolve(aData.results);
                        },
                        error: (oError) => {
                            reject;
                        }
                    });
                });
                oPromiseNewko.then((aResult) => {
                    aResult.forEach(x => {
                        var oNewko = {
                            "Value": x.Saknr
                        }
                        aNewko.push(oNewko);
                    });
                    const oAppModel = this.getView().getModel("appModel");
                    oAppModel.setProperty("/Newko", aNewko);
                    // create value help dialog
                    this._pValueHelpDialog = Fragment.load({
                        id: "Newko",
                        name: "it.orogel.zcruscottoeleagol.view.VHDialogNewko",
                        controller: this
                    }).then(function (oValueHelpDialog) {
                        oView.addDependent(oValueHelpDialog);
                        return oValueHelpDialog;
                    });
                    this._pValueHelpDialog.then(function (oValueHelpDialog) {
                        oValueHelpDialog.open(sInputValue);
                    });
                }, oError => {
                    MessageToast.show(this.oComponent.i18n().getText("msg.error.Newko.text"));
                    this.oComponent.resetAllBusy();
                });
            },
            onChangeBktxt: function (oEvent) {
                const oAppModel = this.getView().getModel("appModel");
                var AllRows = oAppModel.getProperty("/rows"),
                    index = oEvent.getSource().getParent().getIndex(),
                    AllRowsLength = AllRows.length,
                    oSelected = this.getView().byId("AccountingDocument").getContextByIndex(index).getObject();
                for (var j = 0; j < AllRowsLength; j++) {
                    var oToBeSelect = this.getView().byId("AccountingDocument").getContextByIndex(j).getObject();
                    if (oToBeSelect.Num === oSelected.Num && oToBeSelect.Bukrs === oSelected.Bukrs && oToBeSelect.Blart === oSelected.Blart) {
                        oToBeSelect.Bktxt = oSelected.Bktxt;
                    }
                }
                oAppModel.refresh(true);
            },
            onChangeXblnr: function (oEvent) {
                const oAppModel = this.getView().getModel("appModel");
                var AllRows = oAppModel.getProperty("/rows"),
                    index = oEvent.getSource().getParent().getIndex(),
                    AllRowsLength = AllRows.length,
                    oSelected = this.getView().byId("AccountingDocument").getContextByIndex(index).getObject();
                for (var j = 0; j < AllRowsLength; j++) {
                    var oToBeSelect = this.getView().byId("AccountingDocument").getContextByIndex(j).getObject();
                    if (oToBeSelect.Num === oSelected.Num && oToBeSelect.Bukrs === oSelected.Bukrs && oToBeSelect.Blart === oSelected.Blart) {
                        oToBeSelect.Xblnr = oSelected.Xblnr;
                    }
                }
                oAppModel.refresh(true);
            },
            onChangeNewko: function (oEvent) {
                const oAppModel = this.getView().getModel("appModel");
                var AllRows = oAppModel.getProperty("/rows"),
                    index = oEvent.getSource().getParent().getIndex(),
                    AllRowsLength = AllRows.length,
                    oSelected = this.getView().byId("AccountingDocument").getContextByIndex(index).getObject();
                for (var j = 0; j < AllRowsLength; j++) {
                    var oToBeSelect = this.getView().byId("AccountingDocument").getContextByIndex(j).getObject();
                    if (oToBeSelect.Num === oSelected.Num && oToBeSelect.Bukrs === oSelected.Bukrs && oToBeSelect.Blart === oSelected.Blart) {
                        oToBeSelect.Newko = oSelected.Newko;
                    }
                }
                oAppModel.refresh(true);
            },
            onSearchNewko: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter({
                    filters: [
                        new Filter("Value", FilterOperator.Contains, sValue),
                    ],
                    and: false
                });
                var oBinding = oEvent.getParameter("itemsBinding");
                oBinding.filter([oFilter]);
            }, onVHDialogNewkoClose: function (oEvent) {
                var aSelectedItems = oEvent.getParameter("selectedItems");
                const oAppModel = this.getView().getModel("appModel");
                if (aSelectedItems && aSelectedItems.length > 0) {
                    var oSelected = this.getView().byId("AccountingDocument").getContextByIndex(this.IndiceValueHelp).getObject();
                    var Newko = oEvent.getParameter("selectedContexts").map(function (oContext) { return oContext.getObject().Value; })[0];
                    oSelected.Newko = Newko;
                }
                oAppModel.refresh(true);
            },
        });
        /**
        * Set table model 
        * ---------------
        * @param aProducts - products
        * @private
        */
        oAppController.prototype._setTableModel = function (aResults) {
            //set model: concat new batch of data to previous model
            const oAppModel = this.getView().getModel("appModel");
            const oTable = this.getView().byId("AccountingDocument");
            oAppModel.setProperty("/rows", aResults);
            oAppModel.setProperty("/rowsCBO", JSON.parse(JSON.stringify(aResults)));
            oTable.setModel(oAppModel);
            oTable.bindRows("/rows");
            oTable.sort(oTable.getColumns()[2]);
            oAppModel.refresh(true);
        };
        oAppController.prototype._callSimulazione = function (x, aResultsSimulazione) {
            return new Promise((resolve, reject) => {
                this.getView().getModel("MainModel").create("/HEADERSet", x, {
                    success: (aData) => {
                        aResultsSimulazione.push(aData);
                        resolve();
                    },
                    error: (oError) => {
                        reject;
                    }
                });
            });
        };
        oAppController.prototype._callRegistrazione = function (x, aResultsRegistrazione) {
            return new Promise((resolve, reject) => {
                this.getView().getModel("MainModel").create("/HEADERSet", x, {
                    success: (aData) => {
                        aResultsRegistrazione.push(aData);
                        resolve();
                    },
                    error: (oError) => {
                        reject;
                    }
                });
            });
        };
        return oAppController;
    });
