/**
 * Lista de pacotes NPM comprometidos em incidente de segurança
 * Fonte: Relatório de segurança de setembro 2025
 */

export interface InfectedPackage {
  name: string;
  versions: string[];
  category: string;
}

export const INFECTED_PACKAGES: InfectedPackage[] = [
  // Angular packages
  {
    name: "angulartics2",
    versions: ["14.1.1", "14.1.2"],
    category: "angular",
  },
  {
    name: "ngx-bootstrap",
    versions: ["18.1.4", "19.0.3", "19.0.4", "20.0.3", "20.0.4", "20.0.5"],
    category: "angular",
  },
  {
    name: "ngx-color",
    versions: ["10.0.1", "10.0.2"],
    category: "angular",
  },
  {
    name: "ngx-toastr",
    versions: ["19.0.1", "19.0.2"],
    category: "angular",
  },
  {
    name: "ngx-trend",
    versions: ["8.0.1"],
    category: "angular",
  },
  {
    name: "ngx-ws",
    versions: ["1.1.5", "1.1.6"],
    category: "angular",
  },
  {
    name: "ng2-file-upload",
    versions: ["7.0.2", "7.0.3", "8.0.1", "8.0.2", "8.0.3", "9.0.1"],
    category: "angular",
  },
  {
    name: "mstate-angular",
    versions: ["0.4.4"],
    category: "angular",
  },
  {
    name: "devextreme-angular-rpk",
    versions: ["21.2.8"],
    category: "angular",
  },
  {
    name: "@ui-ux-gang/devextreme-angular-rpk",
    versions: ["24.1.7"],
    category: "angular",
  },
  {
    name: "@ahmedhfarag/ngx-perfect-scrollbar",
    versions: ["20.0.20"],
    category: "angular",
  },
  {
    name: "@ahmedhfarag/ngx-virtual-scroller",
    versions: ["4.0.4"],
    category: "angular",
  },

  // CTRL packages
  {
    name: "@ctrl/deluge",
    versions: ["7.2.1", "7.2.2"],
    category: "ctrl",
  },
  {
    name: "@ctrl/golang-template",
    versions: ["1.4.2", "1.4.3"],
    category: "ctrl",
  },
  {
    name: "@ctrl/magnet-link",
    versions: ["4.0.3", "4.0.4"],
    category: "ctrl",
  },
  {
    name: "@ctrl/ngx-codemirror",
    versions: ["7.0.1", "7.0.2"],
    category: "ctrl",
  },
  {
    name: "@ctrl/ngx-csv",
    versions: ["6.0.1", "6.0.2"],
    category: "ctrl",
  },
  {
    name: "@ctrl/ngx-emoji-mart",
    versions: ["9.2.1", "9.2.2"],
    category: "ctrl",
  },
  {
    name: "@ctrl/ngx-rightclick",
    versions: ["4.0.1", "4.0.2"],
    category: "ctrl",
  },
  {
    name: "@ctrl/qbittorrent",
    versions: ["9.7.1", "9.7.2"],
    category: "ctrl",
  },
  {
    name: "@ctrl/react-adsense",
    versions: ["2.0.1", "2.0.2"],
    category: "ctrl",
  },
  {
    name: "@ctrl/shared-torrent",
    versions: ["6.3.1", "6.3.2"],
    category: "ctrl",
  },
  {
    name: "@ctrl/tinycolor",
    versions: ["4.1.1", "4.1.2"],
    category: "ctrl",
  },
  {
    name: "@ctrl/torrent-file",
    versions: ["4.1.1", "4.1.2"],
    category: "ctrl",
  },
  {
    name: "@ctrl/transmission",
    versions: ["7.3.1"],
    category: "ctrl",
  },
  {
    name: "@ctrl/ts-base32",
    versions: ["4.0.1", "4.0.2"],
    category: "ctrl",
  },

  // NativeScript packages
  {
    name: "@nativescript-community/arraybuffers",
    versions: ["1.1.6", "1.1.7", "1.1.8"],
    category: "nativescript",
  },
  {
    name: "@nativescript-community/gesturehandler",
    versions: ["2.0.35"],
    category: "nativescript",
  },
  {
    name: "@nativescript-community/perms",
    versions: ["3.0.5", "3.0.6", "3.0.7", "3.0.8"],
    category: "nativescript",
  },
  {
    name: "@nativescript-community/sentry",
    versions: ["4.6.43"],
    category: "nativescript",
  },
  {
    name: "@nativescript-community/sqlite",
    versions: ["3.5.2", "3.5.3", "3.5.4", "3.5.5"],
    category: "nativescript",
  },
  {
    name: "@nativescript-community/text",
    versions: ["1.6.9", "1.6.10", "1.6.11", "1.6.12", "1.6.13"],
    category: "nativescript",
  },
  {
    name: "@nativescript-community/typeorm",
    versions: ["0.2.30", "0.2.31", "0.2.32", "0.2.33"],
    category: "nativescript",
  },
  {
    name: "@nativescript-community/ui-collectionview",
    versions: ["6.0.6"],
    category: "nativescript",
  },
  {
    name: "@nativescript-community/ui-document-picker",
    versions: ["1.1.27", "1.1.28"],
    category: "nativescript",
  },
  {
    name: "@nativescript-community/ui-drawer",
    versions: ["0.1.30"],
    category: "nativescript",
  },
  {
    name: "@nativescript-community/ui-image",
    versions: ["4.5.6"],
    category: "nativescript",
  },
  {
    name: "@nativescript-community/ui-label",
    versions: ["1.3.35", "1.3.36", "1.3.37"],
    category: "nativescript",
  },
  {
    name: "@nativescript-community/ui-material-bottom-navigation",
    versions: ["7.2.72", "7.2.73", "7.2.74", "7.2.75"],
    category: "nativescript",
  },
  {
    name: "@nativescript-community/ui-material-bottomsheet",
    versions: ["7.2.72"],
    category: "nativescript",
  },
  {
    name: "@nativescript-community/ui-material-core",
    versions: ["7.2.72", "7.2.73", "7.2.74", "7.2.75", "7.2.76"],
    category: "nativescript",
  },
  {
    name: "@nativescript-community/ui-material-core-tabs",
    versions: ["7.2.72", "7.2.73", "7.2.74", "7.2.75", "7.2.76"],
    category: "nativescript",
  },
  {
    name: "@nativescript-community/ui-material-ripple",
    versions: ["7.2.72", "7.2.73", "7.2.74", "7.2.75"],
    category: "nativescript",
  },
  {
    name: "@nativescript-community/ui-material-tabs",
    versions: ["7.2.72", "7.2.73", "7.2.74", "7.2.75"],
    category: "nativescript",
  },
  {
    name: "@nativescript-community/ui-pager",
    versions: ["14.1.36", "14.1.37", "14.1.38"],
    category: "nativescript",
  },
  {
    name: "@nativescript-community/ui-pulltorefresh",
    versions: ["2.5.4", "2.5.5", "2.5.6", "2.5.7"],
    category: "nativescript",
  },

  // NStudio packages
  {
    name: "@nstudio/angular",
    versions: ["20.0.4", "20.0.5", "20.0.6"],
    category: "nstudio",
  },
  {
    name: "@nstudio/focus",
    versions: ["20.0.4", "20.0.5", "20.0.6"],
    category: "nstudio",
  },
  {
    name: "@nstudio/nativescript-checkbox",
    versions: ["2.0.6", "2.0.7", "2.0.8", "2.0.9"],
    category: "nstudio",
  },
  {
    name: "@nstudio/nativescript-loading-indicator",
    versions: ["5.0.1", "5.0.2", "5.0.3", "5.0.4"],
    category: "nstudio",
  },
  {
    name: "@nstudio/ui-collectionview",
    versions: ["5.1.11", "5.1.12", "5.1.13", "5.1.14"],
    category: "nstudio",
  },
  {
    name: "@nstudio/web-angular",
    versions: ["20.0.4"],
    category: "nstudio",
  },
  {
    name: "@nstudio/web",
    versions: ["20.0.4"],
    category: "nstudio",
  },
  {
    name: "@nstudio/xplat-utils",
    versions: ["20.0.5", "20.0.6", "20.0.7"],
    category: "nstudio",
  },
  {
    name: "@nstudio/xplat",
    versions: ["20.0.5", "20.0.6", "20.0.7"],
    category: "nstudio",
  },

  // Art-ws packages
  {
    name: "@art-ws/common",
    versions: ["2.0.28"],
    category: "art-ws",
  },
  {
    name: "@art-ws/config-eslint",
    versions: ["2.0.4", "2.0.5"],
    category: "art-ws",
  },
  {
    name: "@art-ws/config-ts",
    versions: ["2.0.7", "2.0.8"],
    category: "art-ws",
  },
  {
    name: "@art-ws/db-context",
    versions: ["2.0.24"],
    category: "art-ws",
  },
  {
    name: "@art-ws/di-node",
    versions: ["2.0.13"],
    category: "art-ws",
  },
  {
    name: "@art-ws/di",
    versions: ["2.0.28", "2.0.32"],
    category: "art-ws",
  },
  {
    name: "@art-ws/eslint",
    versions: ["1.0.5", "1.0.6"],
    category: "art-ws",
  },
  {
    name: "@art-ws/fastify-http-server",
    versions: ["2.0.24", "2.0.27"],
    category: "art-ws",
  },
  {
    name: "@art-ws/http-server",
    versions: ["2.0.21", "2.0.25"],
    category: "art-ws",
  },
  {
    name: "@art-ws/openapi",
    versions: ["0.1.9", "0.1.12"],
    category: "art-ws",
  },
  {
    name: "@art-ws/package-base",
    versions: ["1.0.5", "1.0.6"],
    category: "art-ws",
  },
  {
    name: "@art-ws/prettier",
    versions: ["1.0.5", "1.0.6"],
    category: "art-ws",
  },
  {
    name: "@art-ws/slf",
    versions: ["2.0.15", "2.0.22"],
    category: "art-ws",
  },
  {
    name: "@art-ws/ssl-info",
    versions: ["1.0.9", "1.0.10"],
    category: "art-ws",
  },
  {
    name: "@art-ws/web-app",
    versions: ["1.0.3", "1.0.4"],
    category: "art-ws",
  },

  // CrowdStrike packages
  {
    name: "@crowdstrike/commitlint",
    versions: ["8.1.1", "8.1.2"],
    category: "crowdstrike",
  },
  {
    name: "@crowdstrike/falcon-shoelace",
    versions: ["0.4.1", "0.4.2"],
    category: "crowdstrike",
  },
  {
    name: "@crowdstrike/foundry-js",
    versions: ["0.19.1", "0.19.2"],
    category: "crowdstrike",
  },
  {
    name: "@crowdstrike/glide-core",
    versions: ["0.34.2", "0.34.3"],
    category: "crowdstrike",
  },
  {
    name: "@crowdstrike/logscale-dashboard",
    versions: ["1.205.1", "1.205.2"],
    category: "crowdstrike",
  },
  {
    name: "@crowdstrike/logscale-file-editor",
    versions: ["1.205.1", "1.205.2"],
    category: "crowdstrike",
  },
  {
    name: "@crowdstrike/logscale-parser-edit",
    versions: ["1.205.1", "1.205.2"],
    category: "crowdstrike",
  },
  {
    name: "@crowdstrike/logscale-search",
    versions: ["1.205.1", "1.205.2"],
    category: "crowdstrike",
  },
  {
    name: "@crowdstrike/tailwind-toucan-base",
    versions: ["5.0.1", "5.0.2"],
    category: "crowdstrike",
  },
  {
    name: "eslint-config-crowdstrike-node",
    versions: ["4.0.3", "4.0.4"],
    category: "crowdstrike",
  },
  {
    name: "eslint-config-crowdstrike",
    versions: ["11.0.2", "11.0.3"],
    category: "crowdstrike",
  },
  {
    name: "remark-preset-lint-crowdstrike",
    versions: ["4.0.1", "4.0.2"],
    category: "crowdstrike",
  },

  // Operato packages
  {
    name: "@operato/board",
    versions: [
      "9.0.36",
      "9.0.37",
      "9.0.38",
      "9.0.39",
      "9.0.40",
      "9.0.41",
      "9.0.42",
      "9.0.43",
      "9.0.44",
      "9.0.45",
      "9.0.46",
    ],
    category: "operato",
  },
  {
    name: "@operato/data-grist",
    versions: ["9.0.29", "9.0.35", "9.0.36", "9.0.37"],
    category: "operato",
  },
  {
    name: "@operato/graphql",
    versions: [
      "9.0.22",
      "9.0.35",
      "9.0.36",
      "9.0.37",
      "9.0.38",
      "9.0.39",
      "9.0.40",
      "9.0.41",
      "9.0.42",
      "9.0.43",
      "9.0.44",
      "9.0.45",
      "9.0.46",
    ],
    category: "operato",
  },
  {
    name: "@operato/headroom",
    versions: ["9.0.2", "9.0.35", "9.0.36", "9.0.37"],
    category: "operato",
  },
  {
    name: "@operato/help",
    versions: [
      "9.0.35",
      "9.0.36",
      "9.0.37",
      "9.0.38",
      "9.0.39",
      "9.0.40",
      "9.0.41",
      "9.0.42",
      "9.0.43",
      "9.0.44",
      "9.0.45",
      "9.0.46",
    ],
    category: "operato",
  },
  {
    name: "@operato/i18n",
    versions: ["9.0.35", "9.0.36", "9.0.37"],
    category: "operato",
  },
  {
    name: "@operato/input",
    versions: [
      "9.0.27",
      "9.0.35",
      "9.0.36",
      "9.0.37",
      "9.0.38",
      "9.0.39",
      "9.0.40",
      "9.0.41",
      "9.0.42",
      "9.0.43",
      "9.0.44",
      "9.0.45",
      "9.0.46",
      "9.0.47",
      "9.0.48",
    ],
    category: "operato",
  },
  {
    name: "@operato/layout",
    versions: ["9.0.35", "9.0.36", "9.0.37"],
    category: "operato",
  },
  {
    name: "@operato/popup",
    versions: [
      "9.0.22",
      "9.0.35",
      "9.0.36",
      "9.0.37",
      "9.0.38",
      "9.0.39",
      "9.0.40",
      "9.0.41",
      "9.0.42",
      "9.0.43",
      "9.0.44",
      "9.0.45",
      "9.0.46",
      "9.0.49",
    ],
    category: "operato",
  },
  {
    name: "@operato/pull-to-refresh",
    versions: [
      "9.0.36",
      "9.0.37",
      "9.0.38",
      "9.0.39",
      "9.0.40",
      "9.0.41",
      "9.0.42",
    ],
    category: "operato",
  },
  {
    name: "@operato/shell",
    versions: ["9.0.22", "9.0.35", "9.0.36", "9.0.37", "9.0.38", "9.0.39"],
    category: "operato",
  },
  {
    name: "@operato/styles",
    versions: ["9.0.2", "9.0.35", "9.0.36", "9.0.37"],
    category: "operato",
  },
  {
    name: "@operato/utils",
    versions: [
      "9.0.22",
      "9.0.35",
      "9.0.36",
      "9.0.37",
      "9.0.38",
      "9.0.39",
      "9.0.40",
      "9.0.41",
      "9.0.42",
      "9.0.43",
      "9.0.44",
      "9.0.45",
      "9.0.46",
      "9.0.49",
    ],
    category: "operato",
  },

  // Things Factory packages
  {
    name: "@things-factory/attachment-base",
    versions: [
      "9.0.43",
      "9.0.44",
      "9.0.45",
      "9.0.46",
      "9.0.47",
      "9.0.48",
      "9.0.49",
      "9.0.50",
    ],
    category: "things-factory",
  },
  {
    name: "@things-factory/auth-base",
    versions: ["9.0.43", "9.0.44", "9.0.45"],
    category: "things-factory",
  },
  {
    name: "@things-factory/email-base",
    versions: [
      "9.0.42",
      "9.0.43",
      "9.0.44",
      "9.0.45",
      "9.0.46",
      "9.0.47",
      "9.0.48",
      "9.0.49",
      "9.0.50",
      "9.0.51",
      "9.0.52",
      "9.0.53",
      "9.0.54",
    ],
    category: "things-factory",
  },
  {
    name: "@things-factory/env",
    versions: ["9.0.42", "9.0.43", "9.0.44", "9.0.45"],
    category: "things-factory",
  },
  {
    name: "@things-factory/integration-base",
    versions: ["9.0.43", "9.0.44", "9.0.45"],
    category: "things-factory",
  },
  {
    name: "@things-factory/integration-marketplace",
    versions: ["9.0.43", "9.0.44", "9.0.45"],
    category: "things-factory",
  },
  {
    name: "@things-factory/shell",
    versions: ["9.0.43", "9.0.44", "9.0.45"],
    category: "things-factory",
  },

  // Teselagen packages
  {
    name: "@teselagen/bio-parsers",
    versions: ["0.4.30"],
    category: "teselagen",
  },
  {
    name: "@teselagen/bounce-loader",
    versions: ["0.3.16", "0.3.17"],
    category: "teselagen",
  },
  {
    name: "@teselagen/file-utils",
    versions: ["0.3.22"],
    category: "teselagen",
  },
  {
    name: "@teselagen/liquibase-tools",
    versions: ["0.4.1"],
    category: "teselagen",
  },
  {
    name: "@teselagen/ove",
    versions: ["0.7.40"],
    category: "teselagen",
  },
  {
    name: "@teselagen/range-utils",
    versions: ["0.3.14", "0.3.15"],
    category: "teselagen",
  },
  {
    name: "@teselagen/react-list",
    versions: ["0.8.19", "0.8.20"],
    category: "teselagen",
  },
  {
    name: "@teselagen/react-table",
    versions: ["6.10.19", "6.10.20", "6.10.22"],
    category: "teselagen",
  },
  {
    name: "@teselagen/sequence-utils",
    versions: ["0.3.34"],
    category: "teselagen",
  },
  {
    name: "@teselagen/ui",
    versions: ["0.9.10"],
    category: "teselagen",
  },
  {
    name: "eslint-config-teselagen",
    versions: ["6.1.7", "6.1.8"],
    category: "teselagen",
  },
  {
    name: "graphql-sequelize-teselagen",
    versions: ["5.3.8", "5.3.9"],
    category: "teselagen",
  },
  {
    name: "teselagen-interval-tree",
    versions: ["1.1.2"],
    category: "teselagen",
  },
  {
    name: "tg-client-query-builder",
    versions: ["2.14.4", "2.14.5"],
    category: "teselagen",
  },
  {
    name: "tg-redbird",
    versions: ["1.3.1", "1.3.2"],
    category: "teselagen",
  },
  {
    name: "tg-seq-gen",
    versions: ["1.0.9", "1.0.10"],
    category: "teselagen",
  },

  // HestJS packages
  {
    name: "@hestjs/core",
    versions: ["0.2.1"],
    category: "hestjs",
  },
  {
    name: "@hestjs/cqrs",
    versions: ["0.1.6"],
    category: "hestjs",
  },
  {
    name: "@hestjs/demo",
    versions: ["0.1.2"],
    category: "hestjs",
  },
  {
    name: "@hestjs/eslint-config",
    versions: ["0.1.2"],
    category: "hestjs",
  },
  {
    name: "@hestjs/logger",
    versions: ["0.1.6"],
    category: "hestjs",
  },
  {
    name: "@hestjs/scalar",
    versions: ["0.1.7"],
    category: "hestjs",
  },
  {
    name: "@hestjs/validation",
    versions: ["0.1.6"],
    category: "hestjs",
  },
  {
    name: "create-hest-app",
    versions: ["0.1.9"],
    category: "hestjs",
  },

  // React packages
  {
    name: "react-complaint-image",
    versions: ["0.0.32", "0.0.35"],
    category: "react",
  },
  {
    name: "react-jsonschema-form-conditionals",
    versions: ["0.3.18", "0.3.21"],
    category: "react",
  },
  {
    name: "react-jsonschema-form-extras",
    versions: ["1.0.4"],
    category: "react",
  },
  {
    name: "react-jsonschema-rxnt-extras",
    versions: ["0.4.9"],
    category: "react",
  },
  {
    name: "mstate-react",
    versions: ["1.6.5"],
    category: "react",
  },
  {
    name: "mstate-dev-react",
    versions: ["1.1.1"],
    category: "react",
  },
  {
    name: "thangved-react-grid",
    versions: ["1.0.3"],
    category: "react",
  },

  // RXNT packages
  {
    name: "rxnt-authentication",
    versions: ["0.0.3", "0.0.4", "0.0.5", "0.0.6"],
    category: "rxnt",
  },
  {
    name: "rxnt-healthchecks-nestjs",
    versions: ["1.0.2", "1.0.3", "1.0.4", "1.0.5"],
    category: "rxnt",
  },
  {
    name: "rxnt-kue",
    versions: ["1.0.4", "1.0.5", "1.0.6", "1.0.7"],
    category: "rxnt",
  },

  // TNF packages
  {
    name: "@tnf-dev/api",
    versions: ["1.0.8"],
    category: "tnf",
  },
  {
    name: "@tnf-dev/core",
    versions: ["1.0.8"],
    category: "tnf",
  },
  {
    name: "@tnf-dev/js",
    versions: ["1.0.8"],
    category: "tnf",
  },
  {
    name: "@tnf-dev/mui",
    versions: ["1.0.8"],
    category: "tnf",
  },
  {
    name: "@tnf-dev/react",
    versions: ["1.0.8"],
    category: "tnf",
  },

  // Yoobic packages
  {
    name: "@yoobic/design-system",
    versions: ["6.5.17"],
    category: "yoobic",
  },
  {
    name: "@yoobic/jpeg-camera-es6",
    versions: ["1.0.13"],
    category: "yoobic",
  },
  {
    name: "@yoobic/yobi",
    versions: ["8.7.53"],
    category: "yoobic",
  },
  {
    name: "yoo-styles",
    versions: ["6.0.326"],
    category: "yoobic",
  },

  // Nexe packages
  {
    name: "@nexe/config-manager",
    versions: ["0.1.1"],
    category: "nexe",
  },
  {
    name: "@nexe/eslint-config",
    versions: ["0.1.1"],
    category: "nexe",
  },
  {
    name: "@nexe/logger",
    versions: ["0.1.3"],
    category: "nexe",
  },

  // Ember packages
  {
    name: "ember-browser-services",
    versions: ["5.0.2", "5.0.3"],
    category: "ember",
  },
  {
    name: "ember-headless-form-yup",
    versions: ["1.0.1"],
    category: "ember",
  },
  {
    name: "ember-headless-form",
    versions: ["1.1.2", "1.1.3"],
    category: "ember",
  },
  {
    name: "ember-headless-table",
    versions: ["2.1.5", "2.1.6"],
    category: "ember",
  },
  {
    name: "ember-url-hash-polyfill",
    versions: ["1.0.12", "1.0.13"],
    category: "ember",
  },
  {
    name: "ember-velcro",
    versions: ["2.2.1", "2.2.2"],
    category: "ember",
  },

  // Capacitor packages
  {
    name: "capacitor-notificationhandler",
    versions: ["0.0.2", "0.0.3"],
    category: "capacitor",
  },
  {
    name: "capacitor-plugin-healthapp",
    versions: ["0.0.2", "0.0.3"],
    category: "capacitor",
  },
  {
    name: "capacitor-plugin-ihealth",
    versions: ["1.1.8", "1.1.9"],
    category: "capacitor",
  },
  {
    name: "capacitor-plugin-vonage",
    versions: ["1.0.2", "1.0.3"],
    category: "capacitor",
  },
  {
    name: "capacitorandroidpermissions",
    versions: ["0.0.4", "0.0.5"],
    category: "capacitor",
  },

  // Cordova packages
  {
    name: "config-cordova",
    versions: ["0.8.5"],
    category: "cordova",
  },
  {
    name: "cordova-plugin-voxeet2",
    versions: ["1.0.24"],
    category: "cordova",
  },
  {
    name: "cordova-voxeet",
    versions: ["1.0.32"],
    category: "cordova",
  },

  // TypeScript packages
  {
    name: "ts-gaussian",
    versions: ["3.0.5", "3.0.6"],
    category: "typescript",
  },
  {
    name: "ts-imports",
    versions: ["1.0.1", "1.0.2"],
    category: "typescript",
  },

  // SWC packages
  {
    name: "swc-plugin-component-annotate",
    versions: ["1.9.1", "1.9.2"],
    category: "swc",
  },

  // Koa packages
  {
    name: "koa2-swagger-ui",
    versions: ["5.11.1", "5.11.2"],
    category: "koa",
  },

  // Misc packages
  {
    name: "encounter-playground",
    versions: ["0.0.2", "0.0.3", "0.0.4", "0.0.5"],
    category: "misc",
  },
  {
    name: "json-rules-engine-simplified",
    versions: ["0.2.1", "0.2.4"],
    category: "misc",
  },
  {
    name: "@thangved/callback-window",
    versions: ["1.1.4"],
    category: "misc",
  },
  {
    name: "airchief",
    versions: ["0.3.1"],
    category: "misc",
  },
  {
    name: "airpilot",
    versions: ["0.8.8"],
    category: "misc",
  },
  {
    name: "browser-webdriver-downloader",
    versions: ["3.0.8"],
    category: "misc",
  },
  {
    name: "db-evo",
    versions: ["1.1.4", "1.1.5"],
    category: "misc",
  },
  {
    name: "globalize-rpk",
    versions: ["1.7.4"],
    category: "misc",
  },
  {
    name: "html-to-base64-image",
    versions: ["1.0.2"],
    category: "misc",
  },
  {
    name: "jumpgate",
    versions: ["0.0.2"],
    category: "misc",
  },
  {
    name: "mcfly-semantic-release",
    versions: ["1.3.1"],
    category: "misc",
  },
  {
    name: "mcp-knowledge-base",
    versions: ["0.0.2"],
    category: "misc",
  },
  {
    name: "mcp-knowledge-graph",
    versions: ["1.2.1"],
    category: "misc",
  },
  {
    name: "mobioffice-cli",
    versions: ["1.0.3"],
    category: "misc",
  },
  {
    name: "monorepo-next",
    versions: ["13.0.1", "13.0.2"],
    category: "misc",
  },
  {
    name: "mstate-cli",
    versions: ["0.4.7"],
    category: "misc",
  },
  {
    name: "oradm-to-gql",
    versions: ["35.0.14", "35.0.15"],
    category: "misc",
  },
  {
    name: "oradm-to-sqlz",
    versions: ["1.1.2"],
    category: "misc",
  },
  {
    name: "ove-auto-annotate",
    versions: ["0.0.9", "0.0.10"],
    category: "misc",
  },
  {
    name: "pm2-gelf-json",
    versions: ["1.0.4", "1.0.5"],
    category: "misc",
  },
  {
    name: "printjs-rpk",
    versions: ["1.6.1"],
    category: "misc",
  },
  {
    name: "tbssnch",
    versions: ["1.0.2"],
    category: "misc",
  },
  {
    name: "tvi-cli",
    versions: ["0.1.5"],
    category: "misc",
  },
  {
    name: "ve-bamreader",
    versions: ["0.2.6", "0.2.7"],
    category: "misc",
  },
  {
    name: "ve-editor",
    versions: ["1.0.1", "1.0.2"],
    category: "misc",
  },
  {
    name: "verror-extra",
    versions: ["6.0.1"],
    category: "misc",
  },
  {
    name: "voip-callkit",
    versions: ["1.0.2", "1.0.3"],
    category: "misc",
  },
  {
    name: "wdio-web-reporter",
    versions: ["0.1.3"],
    category: "misc",
  },
  {
    name: "yargs-help-output",
    versions: ["5.0.3"],
    category: "misc",
  },
];

// Mapas para verificação rápida
export const INFECTED_PACKAGE_NAMES = new Set(
  INFECTED_PACKAGES.map((pkg) => pkg.name)
);

export const INFECTED_PACKAGE_MAP = new Map(
  INFECTED_PACKAGES.map((pkg) => [pkg.name, pkg])
);

// Indicadores de comprometimento
export const MALWARE_INDICATORS = {
  bundleHash:
    "46faab8ab153fae6e80e7cca38eab363075bb524edd79e42269217a083628f09",
  webhookEndpoint: "webhook.site/bb8ca5f6-4175-45d2-b042-fc9ebb8170b7",
  lifecycleScript: "node bundle.js",
};

/**
 * Verifica se um pacote está na lista de infectados
 */
export function isPackageInfected(
  packageName: string,
  version?: string
): {
  infected: boolean;
  infectedVersions?: string[];
  specificVersion?: boolean;
} {
  const pkg = INFECTED_PACKAGE_MAP.get(packageName);

  if (!pkg) {
    return { infected: false };
  }

  if (!version) {
    return {
      infected: true,
      infectedVersions: pkg.versions,
    };
  }

  const isSpecificVersionInfected = pkg.versions.includes(version);

  return {
    infected: isSpecificVersionInfected,
    infectedVersions: pkg.versions,
    specificVersion: isSpecificVersionInfected,
  };
}

/**
 * Verifica se uma string contém referências a pacotes infectados
 */
export function findInfectedPackagesInText(text: string): InfectedPackage[] {
  const found: InfectedPackage[] = [];

  for (const pkg of INFECTED_PACKAGES) {
    if (text.includes(pkg.name)) {
      found.push(pkg);
    }
  }

  return found;
}

/**
 * Verifica se o ambiente contém indicadores de malware
 */
export function checkMalwareIndicators(
  environment: Record<string, string | number | boolean>
): {
  hasMalware: boolean;
  indicators: string[];
} {
  const indicators: string[] = [];

  // Verifica script de lifecycle
  if (environment.npm_lifecycle_script === MALWARE_INDICATORS.lifecycleScript) {
    indicators.push("Malicious lifecycle script detected");
  }

  // Verifica pacotes infectados no environment
  for (const [key, value] of Object.entries(environment)) {
    const valueStr = String(value).toLowerCase();

    // Verifica hash do bundle.js
    if (valueStr.includes(MALWARE_INDICATORS.bundleHash)) {
      indicators.push("Malicious bundle.js hash detected");
    }

    // Verifica endpoint de exfiltração
    if (valueStr.includes(MALWARE_INDICATORS.webhookEndpoint)) {
      indicators.push("Data exfiltration endpoint detected");
    }

    // Verifica pacotes infectados
    for (const pkg of INFECTED_PACKAGES) {
      if (
        key.includes("npm_package_name") &&
        valueStr === pkg.name.toLowerCase()
      ) {
        indicators.push(`Infected package detected: ${pkg.name}`);
      }

      if (
        key.includes("npm_package_resolved") &&
        valueStr.includes(pkg.name.toLowerCase())
      ) {
        indicators.push(`Infected package in resolved URL: ${pkg.name}`);
      }
    }
  }

  return {
    hasMalware: indicators.length > 0,
    indicators,
  };
}
