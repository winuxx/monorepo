import { DataSource, DataSourceOptions } from 'typeorm';

import config from '~/config';

export const databaseProviders = [
    {
        provide: 'DATA_SOURCE',
        useFactory: async () => {
            const dataSource = new DataSource({
                ...config.db,
                entities: [
                    __dirname + '/../**/*.entity{.ts,.js}',
                ],
                autoLoadEntities: true,
                synchronize: true, // Note: set to false in production
            } as DataSourceOptions);

            return dataSource.initialize();
        },
    },
];
