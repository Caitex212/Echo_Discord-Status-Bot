module.exports = async (serverStatus, ip, port, serverType) => {
    // Offline / no response
    if (!serverStatus) {
        return {
            title: `🔴 Server Offline`,
            description: `**Server is offline or not responding**`,
            color: 0xE74C3C,
            fields: [
                {
                    name: '🌐 Address',
                    value: `${ip}:${port}`,
                    inline: false
                }
            ],
            footer: {
                text: 'Last checked'
            },
            timestamp: new Date()
        };
    }

    try {
        const {
            name,
            map,
            maxplayers,
            numplayers,
            players = [],
            ping,
            connect,
            version
        } = serverStatus;

        const embed = {
            title: `🟢 ${name || 'Unknown Server'}`,
            description: `**Server is online and responding**`,
            color: 0x2ECC71,
            fields: [
                {
                    name: '🌐 Address',
                    value: `${ip}:${port}`,
                    inline: false
                },
                ...(map ? [{
                    name: '🗺️ Map',
                    value: map,
                    inline: true
                }] : []),
                ...(version ? [{
                    name: '🗺️ Version',
                    value: version,
                    inline: true
                }] : []),
                ...((numplayers !== undefined && maxplayers !== undefined) ? [{
                    name: '👥 Players',
                    value: `${numplayers}/${maxplayers}`,
                    inline: true
                }] : []),
                ...(ping ? [{
                    name: '📡 Ping',
                    value: `${ping} ms`,
                    inline: true
                }] : []),
                ...(connect ? [{
                    name: '🔗 Connect',
                    value: `\`${connect}\``,
                    inline: false
                }] : [])
            ],
            footer: {
                text: 'Live server status'
            },
            timestamp: new Date()
        };

        if (players.length > 0) {
            embed.fields.push({
                name: `🎮 Current Players (${players.length})`,
                value: players
                    .map(p => `• ${p.name || 'Unknown Player'}`)
                    .join('\n')
                    .slice(0, 1024) // Discord field safety
            });
        }

        return embed;
        
    } catch (error) {
        console.error('Error creating embed:', error);
        return null;
    }
};
