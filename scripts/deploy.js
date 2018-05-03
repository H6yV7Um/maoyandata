var deploy = require('eden-remote-deploy');

var deploy_cfg = {
    server: {
        from: '/logistics|logisuser|playback|miaosong/*',
        mime: 'application/json'
    },
    host: {
        xuncheng: {
            name: '10.19.145.190',
            receiverPort: 8180,
            sitePort: 8180,
            root: '/home/map/odp_zhongbao/'
        },
        zhaoqi: {
            name: '10.19.161.134',
            receiverPort: 8075,
            sitePort: 8088,
            root: '/home/map/odp_zhongbao/'
        },
        yayun: {
            name: '10.19.161.89',
            receiverPort: 8175,
            sitePort: 8191,
            root: '/home/map/odp_zhongbao/'
        },
        wanjia: {
            name: '10.19.161.122',
            receiverPort: 8075,
            sitePort: 8075,
            root: '/home/map/odp_logistics/'
        },
        wanjia2: {
            name: '10.19.161.122',
            receiverPort: 8075,
            sitePort: 8075,
            root: '/home/map/odp_zhongbao/'
        },
        hairong: {
            name: 'gzhxy-waimai-dcloud13.gzhxy.iwm.name',
            receiverPort: 8255,
            sitePort: 8255,
            root: '/home/map/odp_logistics/'
        },
        liyue: {
            name: '10.19.161.96',
            receiverPort: 8225,
            sitePort: 8225,
            root: '/home/map/odp_zhongbao/'
        },
        xiangqian: {
            name: '10.19.161.96',
            receiverPort: 8155,
            sitePort: 8155,
            root: '/home/map/odp_logistics/'
        },
        xiangqian2: {
            name: '10.19.161.96',
            receiverPort: 8159,
            sitePort: 8159,
            root: '/home/map/odp_zhongbao/'
        },
        hanjiang: {
            name: '10.19.160.65',
            receiverPort: 8056,
            sitePort: 8056,
            root: '/home/map/odp_wrpc/'
        },
        jiyu: {
            name: '10.19.161.89',
            receiverPort: 8075,
            sitePort: 8088,
            root: '/home/map/odp_wrpc/'
        },
        beibei: {
            name: '10.19.161.118',
            receiverPort: 8125,
            sitePort: 8105,
            root: '/home/map/odp_logistics/'
        },
        tianxiong: {
            name: 'gzns-waimai-dcloud32.gzns.iwm.name',
            receiverPort: 8175,
            sitePort: 8109,
            root: '/home/map/odp_logistics/'
        },
        huiqin: {
            name: '10.19.161.95',
            receiverPort: 8025,
            sitePort: 8069,
            root: '/home/map/odp_zhongbao/'
        },
        yalan: {
            name: '10.19.145.188',
            receiverPort: 8025,
            sitePort: 8046,
            root: '/home/map/odp_zhongbao/'
        },
        yanshuo: {
            name: '10.19.161.94',
            receiverPort: 8345,
            sitePort: 8345,
            root: '/home/map/odp_zhongbao/'
        }
    }
};
var eden_config = {
    namespace: 'zhongbaoweb',
    deploy: [{
        from: 'build/**',
        to: `webroot/static/elezhongbao/`
    }, {
        from: 'build/**/*.tpl',
        to: `template/`
    }]
};

var hostName = process.argv[2];


if (hostName && deploy_cfg['host'][hostName]) {
    var receiver = getReceiverURL(deploy_cfg['host'][hostName]);
    console.info('==> 🌎  Receiver:', receiver);

    deploy(eden_config['deploy'], receiver, deploy_cfg['host'][hostName]['root']);
} else {
    console.error('==> 🌎  请输入正确的部署机器名');
}

function getReceiverURL(RD) {
    if (RD) {
        return `http://${RD.name}:${RD.receiverPort}/receiver.php`;
    } else {
        return '';
    }
}
