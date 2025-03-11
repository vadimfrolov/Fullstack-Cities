import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('city')
export class CityEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'int' })
    roll: number;

    @Column({ type: 'varchar' })
    name: string;
    
    @Column({ type: 'varchar', nullable: true })
    name_native: string;
    
    @Column({ type: 'varchar', nullable: true })
    country: string;
    
    @Column({ type: 'varchar', nullable: true })
    continent: string;
    
    @Column({ type: 'varchar', nullable: true })
    latitude: string;
    
    @Column({ type: 'varchar', nullable: true })
    longitude: string;
    
    @Column({ type: 'varchar', nullable: true })
    population: string;
    
    @Column({ type: 'varchar', nullable: true })
    founded: string;
    
    @Column({ type: 'simple-array', nullable: true })
    landmarks: string[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date;
}