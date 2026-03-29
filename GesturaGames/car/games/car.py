import pygame

pygame.init()

WIDTH, HEIGHT = 800, 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Gesture Car Game")

car_x = 370
car_y = 480

clock = pygame.time.Clock()

while True:
    screen.fill((255,255,255))

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            exit()

    # draw simple car
    pygame.draw.rect(screen, (0,0,255), (car_x, car_y, 60, 100))

    pygame.display.update()
    clock.tick(30)
