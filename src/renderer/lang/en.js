export const l = {
    profile:{
        my:'My',
        import:'Import wallet',
        create:'Create wallet',
        phrase:'Export passphrase',
        node:'Node',
        language:'Language',
        delete:'Delete wallet',
        success:'Success',
        reward:'Reward author',
        feedback:'Feedback',
        back:'Not backed up',
        about:'About',
        contact:'Contacts' ,
        close:'Close'
    },
    versionAlert:{
        title:'Discover new version',
        footer:[
            'Cancel',
            'Update'
        ]
    },
    about:{
        application:'Version',
        feedback:'Feedback',
        version:'Version log',
        new:'Check the new version'
    },
    wallet:{
        title:'Total Assets (USD)',
        assets:'Add Assets',
        receive:'Receive',
        send:'Send',
        details:'Details',
        price:'USD',
        stateList:['Not active','Leaseding','Node failure'],
        block:'Block',
        setting:{
            title:'Settings',
            node:'Settings Node',
            del:'Delete',
            cancel:'Cancel',
            apl:'Open node wallet',
            lease:'Lease balance'
        },
        scan:'Please add assets:'
    },
    import:{
        title:'Import wallet',
        name:'Wallet name',
        password:'Wallet password',
        again:'Enter the wallet password again',
        phrase:'Passphrase',
        btn:'Import',
        addr:'Address',

    },
    create:{
        title:'Create wallet',
        name:'Wallet name',
        password:'Wallet password',
        again:'Enter the wallet password again',
        btn:'Create',
        phrase:'Passphrase',
        protocol:'Please read and agree',
        protocolTxt:'&nbsp;Disclaimer agreement'
    },
    peers:{
        title:'Node settings',
        add:'Add node',
        prompt:'example：http://115.171.203.184:7876'
    },
    details:{
        title:'detail',
        quantity:'amount',
        out:'send',
        into:'receive',
        fee:'fee',
        next:'Next page'

    },
    phrase:{
        title:'Import passphrase',
        title1:'Please save your passphrase',
        txt:'These 12 words are the only ones that will restore your wallet, write it correctly on paper, and save it in a safe place.'
    },
    into:{
        title:'Receive',
        addr:'Address',
        amount: 'Amount',
        publickey: 'Publickey',
        please:'Please enter'
    },
    out:{
        title:'Send',
        sum:'Balance',
        to:'Address',
        count:'Count',
        message:'Message',
        fees:'Fee',
        please:'Please enter',
        btn:'Send',
        addr:'Please use Passphrase import，Then do this',
        alertTitle:'Transaction'
    },
    market:{
        title:'Market',
        rank:'Rank',
        amount:'Amount',
        detailsTitle:'Exchange'
    },

    contacts:{
        index:{
            note:'Note',
            payment:'Confirm payment',
            modify:'Modify contacts',
            delete:'Delete contact',
            cancel:'Cancel',
            del:'OK delete user:'
        },
        create:{
            title:'New',
            txt:'Define',
            name:'Name',
            addr:'Wallet address',
            note:'Note',
            add:'Add contact successfully'
        },
        update:{
            title:'Modify',
            update:'Modify contact successfully'
        }

    },
    exchange:{
        details:{
            title:'Transaction details',
            status:'status',
            statuses:{
                new:'New',
                waiting:'Waiting',
                confirming:'Confirming',
                exchanging:'Exchanging',
                sending:'Sending',
                finished:'Finished',
                failed:'Failed',
                refunded:'Refunded',
                expired:'Expired'
            },
            id:'ID',
            sendAmount:'Send Amount',
            receiveAmount:'Receive Amount',
            payinAddress:'Pay in Address',
            payoutAddress:'Pay out Address',
            fee:'Fee',
            updatedAt:'Updated',
            copy:'Copy',
            del:'Delete Record',
            confirm:'Local record, delete cannot be recovered',
            none:'No history'
        },
        index:{
            title:'Coin Exchange',
            records:'Records',
            type:'Type',
            sendCoin:'Send Coin',
            sendAmount:'Send Amount',
            please:'Please enter',
            minAmount:'Min Amount',
            receiveCoin:'Receive Coin',
            receiveAmount:'Receive Amount',
            receiveAddr:'Receive Addr',
            save:'Confirm exchange',
            typeItems: [
                {text: 'Buy', value: 'buy'},
                {text: 'Sell', value: 'sell'},
            ],
            exchangeError:'Please modify Send Amount',
            count:['Your','Not enough'],
            buy01:'Transaction order generated success,Go to history query',
            buy02:'Transaction order generated success,Whether to go to transfer',
            buyError:'Parameter error, please try again',
            message:'Third-party exchange: Changenow, currency transfer time is about 5-60 minutes',
            click:'Click to get',
            not:' Transaction is not supported'
        }
    },
    lease:{
        balance:{
            title:'Lease Balance',
            recipient:'Lease Account',
            period:'Lease Block',
            save:'Save Lease',
            account:{
                title:'Lease Account Info',
                addr:'Addr',
                id:'Account id',
                lessorsLength:'Lease Count',
                lessorsSum:'Lease Sum'
            },
            current:{
                title:'Lease Info',
                addr:'Tenant addr',
                id:'Tenant id',
                heightFrom:'Height From',
                heightTo:'Height To',
                info:'No Lease information'
            },
            periodError:'Please enter the lease number of rental blocks',
            errorCode:'Please enter the lease rental account address',
            nodeError:'Node Error',
            success:'Lease Success'
        }
    },
    transactionDetails:{
        title:'Transaction Record',
        sender:'Sender',
        recipient:'Recipient',
        fee:'Fee',
        note:'Note',
        ecBlock:'Transaction block',
        time:'Transaction time',
        confirm:'Confirm'
    },
    protocol:{
        title:'Disclaimer agreement',
        txt:'Not responsible for the following situations：',
        list:[
            'Users shall take care of their mobile devices, Wallet Password and Mnemonic Words  by themselves. ConsenLabs does not store or hold the above information for Users. You shall be responsible for any risks, liabilities, losses and expenses which result from frauds, you losing your mobile device, disclosing (whether actively or passively) or forgetting Wallet Password, or  Mnemonic Words , or your wallet being attacked.',
            'Follow the Alert. You understand and agree to follow the Alert pushed by Nxt Wallet. You shall be responsible for any risks, liabilities, losses and expenses which result from your failure to comply with the Alert.',
            'You understand that Nxt Wallet undertakes no responsibility to conduct due diligence on the services or transactions provided by third-party-developed DApps. You shall make investment decisions rationally and assume the risks by yourself.',
            'Complete the identification verification. If Nxt Wallet reasonably deems your operation or transactions to be abnormal, or considers your identification to be doubtful, or Nxt Wallet considers it necessary to verify your identification documents or other necessary documents, you shall cooperate with Nxt Wallet and provide your valid identification documents or other necessary documents and complete the identification verification in time.'
        ]
    },
    copy:{
        title:'Copy',
        txt:'Copy success',
    },
    prompt:{
        title:'Prompt',
        api:'Whether to get data from the server interface',
        phrase:'Please enter Passphrase',
        password:'Please enter your password',
        import:'Import success',
        send:'Sending...',
        sent:'Send success',
        version:'Already the latest version',
        disclaimer:'Disclaimer',
        disclaimerTxt:'Nxt Wallet will not be responsible for lost wallets, stolen, lost passwords and other assets.',
        buttonLabels: ['Cancel', 'OK'],
        addr:'Import address shows NXT by default'

    },
    error:{
        phrase:'Wrong Passphrase',
        password:'Wrong password',
        digits:'The password can not be less than 9 digits',
        information:'Please enter all the information',
        message:'Please enter the correct content',
        amount:'Please enter the correct amount',
        addr:'Please enter the correct address',
        sent:'Failed to send',
        node:'Wrong node'
    }
}