[Unit]
Description=Hyper-CSR (csrlinux) service request app
Documentation=https://github.com/vishn2015stp/csrlinux
After=network-online.target postgresql.service
Wants=network-online.target postgresql.service

[Service]
Type=simple
User=__APP_USER__
Group=__APP_USER__
WorkingDirectory=__APP_DIR__
EnvironmentFile=__APP_DIR__/.env
ExecStart=/usr/bin/env node server/server.js
Restart=on-failure
RestartSec=5
KillSignal=SIGTERM
TimeoutStopSec=30
StandardOutput=journal
StandardError=journal
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=full
ProtectHome=true
ReadWritePaths=__APP_DIR__
LimitNOFILE=4096

[Install]
WantedBy=multi-user.target
