import winston, { info } from "winston";

const {combine,timestamp,json,colorize,align,printf} = winston.format;

const logger = winston.createLogger({
    level: 'info',
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD hh:mm:ss.SSS A',
        }),
        json()
    ),
    transports: []
});

if(process.env.NODE_ENV !== 'production'){
    logger.add(
        new winston.transports.Console({
            format: combine(
                colorize({all:true}),
                align(),
                printf((info)=> `[${info.timestamp}] ${info.level}: ${info.message}`)
            ),
        })
    );
}

export default logger;